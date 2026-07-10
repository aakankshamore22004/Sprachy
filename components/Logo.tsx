import { MessageCircle } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const dims = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? 14 : 18;
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dims} grid place-items-center rounded-btn`}
        style={{
          background: "linear-gradient(135deg, #D97757 0%, #C46445 100%)",
          boxShadow: "0 2px 8px rgba(217,119,87,0.35)",
        }}
      >
        <MessageCircle size={iconSize} strokeWidth={2.5} className="text-white" />
      </div>
      <span
        className="text-lg font-extrabold tracking-tight text-ink"
      >
        Sprachy
      </span>
    </div>
  );
}
