import { apiRequest } from "@/lib/api";
import { normalizeComment, normalizePost, normalizeProfile } from "@/lib/normalize";
import { getApiBaseUrl } from "@/lib/server-api";
import type { Comment, Post, Profile, PublicBlogData } from "@/lib/types";

export async function getPublicBlogData(): Promise<PublicBlogData> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return {
      posts: [],
      comments: [],
      profiles: [],
      error:
        "The Blog API URL is not configured. Set BLOG_API_URL and NEXT_PUBLIC_BLOG_API_URL.",
    };
  }

  const options: RequestInit = { signal: AbortSignal.timeout(8000) };
  const [postsResult, commentsResult, profilesResult] = await Promise.allSettled([
    apiRequest<{ publishedPosts: Post[] }>(baseUrl, "/post", options),
    apiRequest<{ comments: Comment[] }>(baseUrl, "/comments", options),
    apiRequest<{ profiles: Profile[] }>(baseUrl, "/profiles", options),
  ]);

  const posts =
    postsResult.status === "fulfilled"
      ? postsResult.value.publishedPosts.map(normalizePost)
      : [];
  const comments =
    commentsResult.status === "fulfilled"
      ? commentsResult.value.comments.map(normalizeComment)
      : [];
  const profiles =
    profilesResult.status === "fulfilled"
      ? profilesResult.value.profiles.map(normalizeProfile)
      : [];
  const failed =
    postsResult.status === "rejected" ||
    commentsResult.status === "rejected" ||
    profilesResult.status === "rejected";

  return {
    posts,
    comments,
    profiles,
    error: failed
      ? "Some blog content could not be loaded. Try again in a moment."
      : null,
  };
}
