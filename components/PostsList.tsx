"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, RefreshCw } from "lucide-react";
import { useBlog } from "@/components/BlogProvider";
import { Notice } from "@/components/Notice";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-US", { timeZone: "UTC" });
}

export function PostsList() {
  const { posts, comments, error, refreshPublicData } = useBlog();

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-leaf">The journal</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Published posts</h1>
      </div>
      {error && (
        <div className="mb-6">
          <Notice kind="error">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>{error}</span>
              <button
                className="inline-flex items-center gap-2 font-semibold underline underline-offset-4"
                onClick={() => void refreshPublicData()}
                type="button"
              >
                <RefreshCw aria-hidden="true" size={15} /> Try again
              </button>
            </div>
          </Notice>
        </div>
      )}
      {posts.length === 0 ? (
        <Notice>
          {error
            ? "Posts are temporarily unavailable. Please retry once the API is reachable."
            : "There are no published posts yet. Please check back soon."}
        </Notice>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <article
              className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-leaf/40"
              key={post.id}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-leaf">
                Published {formatDate(post.publishedAt)}
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold text-white">
                <Link className="hover:text-leaf" href={`/posts/${encodeURIComponent(post.id)}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 line-clamp-4 whitespace-pre-wrap leading-7 text-white/75">
                {post.content}
              </p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-sm text-white/60">
                <span>Created {formatDate(post.createdAt)}</span>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle aria-hidden="true" size={16} />
                  {comments.filter((comment) => comment.postId === post.id).length} comments
                </span>
              </div>
              <Link
                aria-label={`Read ${post.title}`}
                className="mt-5 inline-flex items-center gap-2 font-semibold text-leaf hover:text-white"
                href={`/posts/${encodeURIComponent(post.id)}`}
              >
                Read post <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
