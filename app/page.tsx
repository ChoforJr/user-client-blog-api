import Link from "next/link";

export default function HomePage() {
  return (
    <section className="my-auto flex min-h-[55vh] flex-col items-center justify-center text-center">
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-leaf">
        Stories, ideas, and conversation
      </p>
      <h1 className="max-w-3xl font-display text-5xl font-bold leading-tight text-white sm:text-7xl">
        Welcome to
        <br />
        Chofor&apos;s Blog
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
        Take a moment, find a story, and join the conversation.
      </p>
      <Link
        className="mt-9 rounded-full bg-leaf px-7 py-3 font-bold text-forest transition hover:bg-white"
        href="/posts"
      >
        Explore the posts
      </Link>
    </section>
  );
}
