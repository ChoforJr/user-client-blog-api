"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { normalizeComment } from "@/lib/normalize";
import { useBlog } from "@/components/BlogProvider";
import { Notice } from "@/components/Notice";
import type { Comment } from "@/lib/types";

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : date.toLocaleString("en-US", { timeZone: "UTC" });
}

export function PostDetail({ postId }: { postId: string }) {
  const {
    apiUrl,
    posts,
    comments,
    profiles,
    error: publicError,
    refreshPublicData,
    authenticated,
    authLoading,
    account,
    addComment,
    changeComment,
    removeComment,
    subscribeToPost,
  } = useBlog();
  const post = posts.find((item) => item.id === postId);
  const postComments = comments.filter((comment) => comment.postId === postId);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribeToPost(postId), [postId, subscribeToPost]);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = newComment.trim();
    if (!content) {
      setError("Please enter a comment before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await apiRequest<{ comment: Comment | Comment[] }>(
        apiUrl,
        `/user/post/${encodeURIComponent(postId)}/comment`,
        { method: "POST", body: JSON.stringify({ content }) },
      );
      const comment = Array.isArray(result.comment) ? result.comment[0] : result.comment;
      if (!comment) throw new Error("The API did not return the new comment.");
      addComment(normalizeComment(comment));
      setNewComment("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not submit your comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>, commentId: string) {
    event.preventDefault();
    const content = editedContent.trim();
    if (!content) {
      setError("A comment cannot be empty.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest<unknown>(
        apiUrl,
        `/user/post/comment/${encodeURIComponent(commentId)}`,
        { method: "PUT", body: JSON.stringify({ content }) },
      );
      changeComment(commentId, content);
      setEditingId(null);
      setEditedContent("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update your comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(commentId: string) {
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest<unknown>(
        apiUrl,
        `/user/post/comment/${encodeURIComponent(commentId)}`,
        { method: "DELETE" },
      );
      removeComment(commentId);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete your comment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!post) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        {publicError ? (
          <div className="space-y-4">
            <Notice kind="error">{publicError}</Notice>
            <button
              className="inline-flex items-center gap-2 font-semibold text-leaf hover:text-white"
              onClick={() => void refreshPublicData()}
              type="button"
            >
              <RefreshCw aria-hidden="true" size={16} /> Retry
            </button>
          </div>
        ) : (
          <Notice>{authLoading ? "Loading post…" : "This post could not be found."}</Notice>
        )}
        <Link className="mt-6 inline-flex items-center gap-2 text-leaf hover:text-white" href="/posts">
          <ArrowLeft aria-hidden="true" size={16} /> All posts
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto w-full max-w-3xl">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:text-white" href="/posts">
        <ArrowLeft aria-hidden="true" size={16} /> All posts
      </Link>
      <header className="mb-8 mt-7 border-b border-white/15 pb-7">
        <p className="text-sm font-semibold text-leaf">Published {formatDate(post.publishedAt ?? post.createdAt)}</p>
        <h1 className="mt-3 break-words font-display text-4xl font-bold leading-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-white/60">Created {formatDate(post.createdAt)}</p>
      </header>
      <div className="whitespace-pre-wrap break-words text-base leading-8 text-white/85 sm:text-lg">
        {post.content}
      </div>

      <section aria-labelledby="comments-heading" className="mt-14 border-t border-white/15 pt-8">
        <h2 className="font-display text-3xl font-bold" id="comments-heading">
          Conversation <span className="text-lg font-normal text-white/60">({postComments.length})</span>
        </h2>
        {error && <div className="mt-5"><Notice kind="error">{error}</Notice></div>}
        {authLoading ? null : authenticated ? (
          <form className="mt-6 space-y-3" onSubmit={submitComment}>
            <label className="block text-sm font-semibold" htmlFor="new-comment">
              Add a comment
            </label>
            <textarea
              className="min-h-28 w-full rounded-xl border border-white/20 bg-black/20 p-4 text-white placeholder:text-white/40"
              id="new-comment"
              maxLength={3000}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Share your thoughts…"
              value={newComment}
            />
            <button
              className="rounded-full bg-leaf px-5 py-2.5 font-bold text-forest hover:bg-white"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Sending…" : "Submit comment"}
            </button>
          </form>
        ) : (
          <p className="mt-5 text-white/70">
            <Link className="font-semibold text-leaf hover:text-white" href="/signIn">
              Sign in
            </Link>{" "}
            to comment on this post.
          </p>
        )}
        <div className="mt-8 space-y-4">
          {postComments.length === 0 ? (
            <p className="text-white/60">No comments yet. Start the conversation.</p>
          ) : (
            postComments.map((comment) => {
              const author = profiles.find((profile) => profile.userId === comment.userId);
              const isOwner = account?.id === comment.userId;
              return (
                <article className="rounded-xl border border-white/10 bg-white/[0.05] p-5" key={comment.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-leaf">{author?.displayName || "Reader"}</p>
                    <time className="text-xs text-white/50" dateTime={comment.createdAt}>
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>
                  {editingId === comment.id ? (
                    <form className="mt-4 space-y-3" onSubmit={(event) => void submitEdit(event, comment.id)}>
                      <textarea
                        className="min-h-24 w-full rounded-lg border border-white/20 bg-black/20 p-3"
                        onChange={(event) => setEditedContent(event.target.value)}
                        value={editedContent}
                      />
                      <div className="flex gap-3">
                        <button className="rounded-full bg-leaf px-4 py-2 text-sm font-bold text-forest" disabled={submitting} type="submit">
                          Save
                        </button>
                        <button
                          className="rounded-full border border-white/20 px-4 py-2 text-sm"
                          onClick={() => { setEditingId(null); setEditedContent(""); }}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-white/80">
                      {comment.content}
                    </p>
                  )}
                  {isOwner && editingId !== comment.id && (
                    <div className="mt-4 flex gap-4 text-sm">
                      <button
                        className="font-semibold text-leaf hover:text-white"
                        onClick={() => { setEditingId(comment.id); setEditedContent(comment.content); }}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="font-semibold text-red-300 hover:text-red-100"
                        disabled={submitting}
                        onClick={() => void deleteComment(comment.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </article>
  );
}
