import type { Metadata } from "next";
import { BlogProvider } from "@/components/BlogProvider";
import { SiteShell } from "@/components/SiteShell";
import { getClientApiBaseUrl } from "@/lib/server-api";
import { getPublicBlogData } from "@/lib/server-data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Chofor's Blog",
    template: "%s | Chofor's Blog",
  },
  description: "Read published stories and join the conversation on Chofor's Blog.",
  applicationName: "Chofor's Blog",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [initialData, apiUrl] = await Promise.all([
    getPublicBlogData(),
    Promise.resolve(getClientApiBaseUrl()),
  ]);

  return (
    <html lang="en">
      <body>
        <BlogProvider initialData={initialData} apiUrl={apiUrl}>
          <SiteShell>{children}</SiteShell>
        </BlogProvider>
      </body>
    </html>
  );
}
