"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle, RefreshCw } from "lucide-react";
import { useBlog } from "@/components/BlogProvider";
import { Notice } from "@/components/Notice";
import { MarkdownContent } from "@/components/MarkdownContent";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function getReadingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}

export function PostsList() {
  const { posts, comments, error, refreshPublicData } = useBlog();

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-leaf">A collection of thoughts</p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-paper sm:text-6xl">The journal<span className="text-leaf">.</span></h1>
          <p className="mt-4 max-w-xl leading-7 text-white/60">A reading list for the curious. Pick a story, settle in, and let the ideas wander.</p>
        </div>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/55">
          <BookOpen aria-hidden="true" className="text-leaf" size={17} />
          {posts.length} {posts.length === 1 ? "story" : "stories"}
        </p>
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
          {posts.map((post, index) => (
            <article
              className="group reading-surface relative flex min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-white/10 p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8"
              key={post.id}
            >
              <div aria-hidden="true" className="absolute -right-8 -top-10 font-display text-[10rem] font-bold leading-none text-forest/[0.035] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="relative flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/55">
                  {formatDate(post.publishedAt)}
                </p>
                <span className="rounded-full bg-forest/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest/65">
                  {getReadingTime(post.content)} min read
                </span>
              </div>
              <h2 className="relative mt-8 font-display text-3xl font-medium leading-tight tracking-tight text-forest sm:text-[2rem]">
                <Link className="transition group-hover:text-[#52764e]" href={`/posts/${encodeURIComponent(post.id)}`}>
                  {post.title}
                </Link>
              </h2>
              <MarkdownContent className="relative mt-4 max-h-28 overflow-hidden break-words leading-7 text-forest/70 [&_a]:text-forest [&_a]:underline" content={post.content} />
              <div className="relative mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 pt-6 text-xs font-medium text-forest/55">
                <span className="inline-flex items-center gap-2">
                  <MessageCircle aria-hidden="true" size={15} className="text-forest/50" />
                  {comments.filter((comment) => comment.postId === post.id).length} comments
                </span>
                <Link
                  aria-label={`Read ${post.title}`}
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-xs font-bold text-paper transition group-hover:bg-[#31583c]"
                  href={`/posts/${encodeURIComponent(post.id)}`}
                >
                  Read story <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
