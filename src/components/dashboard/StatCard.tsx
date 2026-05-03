import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  sub?: string;
  delta?: { value: number; positive: boolean } | null;
  hint?: ReactNode;
  accent?: "default" | "brand";
};

export function StatCard({
  label,
  value,
  sub,
  delta,
  hint,
  accent = "default",
}: Props) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent === "brand"
          ? "border-(--mink-brand-a60) bg-linear-to-b from-brand/16 to-brand/4"
          : "border-white/8 bg-white/2"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-(--mink-text-muted)">
          {label}
        </div>
        {delta ? (
          <span
            className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold ${
              delta.positive
                ? "bg-teal-400/12 text-teal-300"
                : "bg-red-500/12 text-red-300"
            }`}
          >
            <span aria-hidden>{delta.positive ? "↑" : "↓"}</span>
            {Math.abs(delta.value)}%
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>
      {sub ? (
        <div className="mt-1 text-xs text-(--mink-text-muted)">{sub}</div>
      ) : null}
      {hint ? (
        <div className="mt-3 text-[11px] text-(--mink-text-faint,#6a6a70)">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
