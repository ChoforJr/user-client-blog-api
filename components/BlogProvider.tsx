"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { deduplicateById, upsertById } from "@/lib/api-utils";
import { normalizeComment, normalizePost, normalizeProfile } from "@/lib/normalize";
import type {
  Account,
  AccountResponse,
  Comment,
  Post,
  Profile,
  PublicBlogData,
} from "@/lib/types";

interface BlogContextValue extends PublicBlogData {
  apiUrl: string;
  account: Account | null;
  authenticated: boolean;
  authLoading: boolean;
  refreshPublicData: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  addComment: (comment: Comment) => void;
  changeComment: (id: string, content: string) => void;
  removeComment: (id: string) => void;
  changeAccountInfo: (updates: Partial<Account>) => void;
  deleteAccount: () => Promise<void>;
  subscribeToPost: (postId: string) => () => void;
}

const BlogContext = createContext<BlogContextValue | null>(null);

interface BlogProviderProps {
  children: ReactNode;
  initialData: PublicBlogData;
  apiUrl: string;
}

function accountFromResponse(result: AccountResponse): Account {
  return {
    id: String(result.user.id),
    username: result.user.username,
    createdAt: result.user.createdAt,
    role: result.user.role,
    displayName: result.user.profile?.displayName ?? "",
    bio: result.user.profile?.bio ?? "",
  };
}

export function BlogProvider({
  children,
  initialData,
  apiUrl,
}: BlogProviderProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialData.posts);
  const [comments, setComments] = useState(() =>
    deduplicateById(initialData.comments),
  );
  const [profiles, setProfiles] = useState(initialData.profiles);
  const [error, setError] = useState(initialData.error);
  const [account, setAccount] = useState<Account | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const subscriptions = useRef(new Set<number>());
  const socket = useRef<WebSocket | null>(null);
  const sendSocketEvent = useCallback((event: string, postId: number) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ event, payload: { postId } }));
    }
  }, []);

  const loadAccount = useCallback(async () => {
    const result = await apiRequest<AccountResponse>(apiUrl, "/user/myProfile");
    setAccount(accountFromResponse(result));
    setAuthenticated(true);
  }, [apiUrl]);

  useEffect(() => {
    void loadAccount()
      .catch((reason: unknown) => {
        if (reason instanceof ApiRequestError && reason.status === 401) {
          setAccount(null);
          setAuthenticated(false);
        }
      })
      .finally(() => setAuthLoading(false));
  }, [loadAccount]);

  const refreshPublicData = useCallback(async () => {
    setError(null);
    try {
      const [postResult, commentResult, profileResult] = await Promise.all([
        apiRequest<{ publishedPosts: Post[] }>(apiUrl, "/post"),
        apiRequest<{ comments: Comment[] }>(apiUrl, "/comments"),
        apiRequest<{ profiles: Profile[] }>(apiUrl, "/profiles"),
      ]);
      setPosts(postResult.publishedPosts.map(normalizePost));
      setComments(
        deduplicateById(commentResult.comments.map(normalizeComment)),
      );
      setProfiles(profileResult.profiles.map(normalizeProfile));
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not load blog content. Please try again.",
      );
    }
  }, [apiUrl]);

  const signIn = useCallback(async (username: string, password: string) => {
    await apiRequest<{
      token?: string;
      user?: AccountResponse["user"];
    }>(apiUrl, "/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    await loadAccount();
    router.replace("/account");
  }, [apiUrl, loadAccount, router]);

  const signOut = useCallback(() => {
    setAccount(null);
    setAuthenticated(false);
    void apiRequest<unknown>(apiUrl, "/logout", { method: "POST" }).catch(() => {
      // The client still clears its in-memory session when the API is unreachable.
    });
    router.push("/signIn");
  }, [apiUrl, router]);

  const addComment = useCallback((comment: Comment) => {
    setComments((current) => upsertById(current, comment));
  }, []);

  const changeComment = useCallback((id: string, content: string) => {
    setComments((current) =>
      current.map((comment) => comment.id === id ? { ...comment, content } : comment),
    );
  }, []);

  const removeComment = useCallback((id: string) => {
    setComments((current) => current.filter((comment) => comment.id !== id));
  }, []);

  const changeAccountInfo = useCallback((updates: Partial<Account>) => {
    setAccount((current) => current ? { ...current, ...updates } : current);
  }, []);

  const deleteAccount = useCallback(async () => {
    await apiRequest<unknown>(apiUrl, "/user/myProfile", { method: "DELETE" });
    setAccount(null);
    setAuthenticated(false);
    router.replace("/signIn");
  }, [apiUrl, router]);

  const subscribeToPost = useCallback((rawPostId: string) => {
    const postId = Number(rawPostId);
    if (!Number.isSafeInteger(postId) || postId <= 0) return () => undefined;

    subscriptions.current.add(postId);
    sendSocketEvent("post:subscribe", postId);
    return () => {
      subscriptions.current.delete(postId);
      sendSocketEvent("post:unsubscribe", postId);
    };
  }, [sendSocketEvent]);

  useEffect(() => {
    if (!apiUrl) return;

    let stopped = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let retryDelay = 1000;
    let activeSocket: WebSocket | undefined;
    const activeSubscriptions = subscriptions.current;

    const connect = () => {
      if (stopped) return;
      try {
        const endpoint = new URL(apiUrl);
        endpoint.protocol = endpoint.protocol === "https:" ? "wss:" : "ws:";
        endpoint.pathname = "/ws";
        endpoint.search = "";
        endpoint.hash = "";
        activeSocket = new WebSocket(endpoint);
        socket.current = activeSocket;

        activeSocket.addEventListener("open", () => {
          if (stopped) return;
          retryDelay = 1000;
          for (const postId of activeSubscriptions) {
            activeSocket?.send(
              JSON.stringify({ event: "post:subscribe", payload: { postId } }),
            );
          }
        });

        activeSocket.addEventListener("message", (message: MessageEvent<string>) => {
          let frame: { event?: unknown; payload?: unknown };
          try {
            frame = JSON.parse(message.data) as typeof frame;
          } catch {
            return;
          }
          const payload =
            frame.payload && typeof frame.payload === "object"
              ? (frame.payload as Record<string, unknown>)
              : {};
          const eventPost = normalizePost(payload as unknown as Post);
          const postId = String(payload.postId ?? payload.id ?? "");

          switch (frame.event) {
            case "post:published":
            case "post:updated":
            case "post:created":
              if (eventPost.published === false) {
                setPosts((current) => current.filter((post) => post.id !== eventPost.id));
              } else if (eventPost.id !== undefined) {
                setPosts((current) => [
                  eventPost,
                  ...current.filter((post) => post.id !== eventPost.id),
                ]);
              } else {
                void refreshPublicData();
              }
              break;
            case "post:deleted":
              setPosts((current) => current.filter((post) => post.id !== postId));
              break;
            case "posts:refresh":
            case "comments:refresh":
              void refreshPublicData();
              break;
            case "comment:created": {
              const comment = payload as unknown as Comment;
              if (comment.id !== undefined && comment.postId !== undefined) {
                const normalizedComment = normalizeComment(comment);
                setComments((current) => upsertById(current, normalizedComment));
              } else {
                void refreshPublicData();
              }
              break;
            }
            case "comment:updated": {
              const comment = payload as unknown as Comment;
              setComments((current) =>
                current.map((item) =>
                  item.id === String(comment.id)
                    ?                     normalizeComment({ ...item, ...comment })
                    : item,
                ),
              );
              break;
            }
            case "comment:deleted": {
              const commentId = String(payload.commentId ?? "");
              setComments((current) => current.filter((item) => item.id !== commentId));
              break;
            }
          }
        });

        activeSocket.addEventListener("close", () => {
          if (socket.current === activeSocket) socket.current = null;
          if (stopped) return;
          reconnectTimer = setTimeout(connect, retryDelay);
          retryDelay = Math.min(retryDelay * 2, 30_000);
        });

        activeSocket.addEventListener("error", () => activeSocket?.close());
      } catch {
        if (!stopped) {
          reconnectTimer = setTimeout(connect, retryDelay);
          retryDelay = Math.min(retryDelay * 2, 30_000);
        }
      }
    };

    connect();
    return () => {
      stopped = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      activeSocket?.close();
      if (socket.current === activeSocket) socket.current = null;
      activeSubscriptions.clear();
    };
  }, [apiUrl, refreshPublicData]);

  const value = useMemo(
    () => ({
      apiUrl,
      posts,
      comments,
      profiles,
      error,
      account,
      authenticated,
      authLoading,
      refreshPublicData,
      signIn,
      signOut,
      addComment,
      changeComment,
      removeComment,
      changeAccountInfo,
      deleteAccount,
      subscribeToPost,
    }),
    [
      apiUrl,
      posts,
      comments,
      profiles,
      error,
      account,
      authenticated,
      authLoading,
      refreshPublicData,
      signIn,
      signOut,
      addComment,
      changeComment,
      removeComment,
      changeAccountInfo,
      deleteAccount,
      subscribeToPost,
    ],
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog(): BlogContextValue {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog must be used within BlogProvider.");
  return context;
}
