import type { Metadata } from "next";
import { PostsList } from "@/components/PostsList";

export const metadata: Metadata = { title: "Published posts" };

export default function PostsPage() {
  return <PostsList />;
}
