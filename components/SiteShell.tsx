"use client";

import { ArrowUpRight, BookOpen, Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Journal" },
  { href: "/account", label: "Your space" },
];

function isActiveRoute(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0a2119]/90 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-12"
        >
          <Link className="group inline-flex items-center gap-3" href="/">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-leaf text-forest shadow-lg shadow-black/10 transition group-hover:-rotate-3 sm:size-10">
              <BookOpen aria-hidden="true" size={20} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block whitespace-nowrap font-display text-base font-bold leading-tight text-white sm:text-xl">Chofor&apos;s Blog</span>
              <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.19em] text-white/45 sm:block">Notes on life &amp; ideas</span>
            </span>
          </Link>
          <div className="flex items-center gap-0.5 sm:gap-2">
            {navigation.map((item) => {
              const isCurrent = isActiveRoute(pathname, item.href);
              return (
                <Link
                  aria-current={isCurrent ? "page" : undefined}
                  className={`${item.href === "/" || item.href === "/account" ? "hidden sm:inline-flex" : "inline-flex"} rounded-full px-2.5 py-2 text-[11px] font-semibold transition sm:px-4 sm:text-sm ${
                    isCurrent
                      ? "bg-white/10 text-leaf"
                      : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-leaf px-3 py-2.5 text-[11px] font-bold text-forest shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-moss sm:ml-3 sm:gap-1.5 sm:px-5 sm:text-sm"
              href="/signIn"
            >
              <span className="sm:hidden">Join</span><span className="hidden sm:inline">Join in</span>
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        {children}
      </main>
      <footer className="mt-16 border-t border-white/[0.09]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <Link className="inline-flex items-center gap-2 font-display text-base font-bold text-white/85" href="/">
            <BookOpen aria-hidden="true" className="text-leaf" size={17} />
            Chofor&apos;s Blog
          </Link>
          <p>A quiet corner for stories worth sitting with.</p>
          <a
            className="inline-flex items-center gap-2 font-semibold transition hover:text-leaf"
            href="https://github.com/ChoforJr/user-client-blog-api"
            target="_blank"
            rel="noreferrer"
          >
            Built by Chofor Forsakang <Github aria-hidden="true" size={15} /> <ArrowUpRight aria-hidden="true" size={13} />
          </a>
        </div>
      </footer>
    </div>
  );
}
