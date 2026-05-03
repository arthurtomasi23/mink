import type { CSSProperties } from "react";

type Props = {
  /** Aspect ratio, expressed as `width / height`. Default `1`. */
  ratio?: number;
  /** Optional caption / label shown faintly in the center. */
  label?: string;
  /** Tailwind utility classes (radius, sizing, etc.). */
  className?: string;
  /** Inline style override (e.g. fixed width/height). */
  style?: CSSProperties;
  /** Render rounded corners radius (default 14). */
  radius?: number;
  /** Whether to show a subtle "image" indicator. Default true. */
  showIcon?: boolean;
};

/**
 * Greyscale placeholder used everywhere on the landing page.
 * Replace with real <Image> tags when art is ready.
 */
export function ImagePlaceholder({
  ratio = 1,
  label,
  className,
  style,
  radius = 14,
  showIcon = true,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        aspectRatio: `${ratio}`,
        borderRadius: radius,
        background:
          "linear-gradient(140deg, #1a1a1d 0%, #232327 50%, #18181b 100%)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 -40px 80px -40px rgba(0,0,0,0.6)",
        ...style,
      }}
      aria-hidden
    >
      {/* faint diagonal stripes texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 14px)",
        }}
      />
      {showIcon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-(--mink-text-faint,#6a6a70)">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="9" cy="9" r="1.5" />
              <path d="m21 15-3.5-4.5L13 16l-2.5-3L3 21" />
            </svg>
            {label ? (
              <span className="text-[11px] font-medium uppercase tracking-wider">
                {label}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
