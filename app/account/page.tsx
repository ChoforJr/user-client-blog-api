import type { Metadata } from "next";
import { AccountPage } from "@/components/AccountPage";

export const metadata: Metadata = { title: "Account" };

export default function AccountRoute() {
  return <AccountPage />;
}
