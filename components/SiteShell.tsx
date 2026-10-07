import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/signIn", label: "Sign in" },
  { href: "/account", label: "Account" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-forest/95 backdrop-blur">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"
        >
          <Link className="font-display text-2xl font-bold text-white" href="/">
            Chofor&apos;s Blog
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/85 sm:gap-8">
            {navigation.map((item) => (
              <Link className="transition hover:text-leaf" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-8">
        {children}
      </main>
      <footer className="border-t border-white/10 px-5 py-6 text-center text-sm text-white/70">
        Made by{" "}
        <a
          className="font-semibold text-white hover:text-leaf"
          href="https://github.com/ChoforJr/user-client-blog-api"
          target="_blank"
          rel="noreferrer"
        >
          Chofor Forsakang
        </a>
      </footer>
    </div>
  );
}
