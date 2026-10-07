import type { ReactNode } from "react";

export function Notice({
  children,
  kind = "info",
}: {
  children: ReactNode;
  kind?: "info" | "error" | "success";
}) {
  const color =
    kind === "error"
      ? "border-red-300/30 bg-red-950/40 text-red-100"
      : kind === "success"
        ? "border-leaf/30 bg-forest/70 text-leaf"
        : "border-white/15 bg-white/5 text-white/85";
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${color}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
