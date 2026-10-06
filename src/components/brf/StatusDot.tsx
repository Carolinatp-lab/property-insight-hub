import type { Status } from "@/data/overview";
import { cn } from "@/lib/utils";

const tone: Record<Status, string> = {
  good: "bg-status-good",
  watch: "bg-status-watch",
  alert: "bg-status-alert",
  neutral: "bg-status-neutral",
};

export function StatusDot({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-2 shrink-0 rounded-full", tone[status], className)}
    />
  );
}
