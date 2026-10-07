import type { Comment, Post, Profile } from "@/lib/types";

export function normalizePost(post: Post): Post {
  return {
    ...post,
    id: String(post.id),
    userId: String(post.userId),
  };
}

export function normalizeComment(comment: Comment): Comment {
  return {
    ...comment,
    id: String(comment.id),
    userId: String(comment.userId),
    postId: String(comment.postId),
  };
}

export function normalizeProfile(profile: Profile): Profile {
  return {
    ...profile,
    id: String(profile.id),
    userId: String(profile.userId),
  };
}
