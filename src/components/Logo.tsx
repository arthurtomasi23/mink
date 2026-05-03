import Link from "next/link";

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Mink — home"
      className={`group inline-flex items-center gap-2 ${className ?? ""}`}
    >
      <span
        className="relative flex h-8 w-8 items-center justify-center rounded-[10px]"
        style={{
          background:
            "conic-gradient(from 220deg at 50% 50%, #7B2CBF, #581A94 35%, #1E1E1E 65%, #7B2CBF)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px -10px rgba(123,44,191,0.7)",
        }}
      >
        <span className="absolute inset-[2px] rounded-[8px] bg-canvas" />
        <span className="relative font-semibold text-[15px] leading-none text-white">
          M
        </span>
      </span>
      {withWordmark ? (
        <span className="text-[17px] font-semibold tracking-tight text-white">
          Mink
        </span>
      ) : null}
    </Link>
  );
}
