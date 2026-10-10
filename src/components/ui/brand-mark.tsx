import { useId } from "react";

const MONOGRAM = "M32 30V70M32 30H56M32 50H68M32 70H56M68 30V70";

/** The supplied EH mark, without its presentation card and caption. */
export function BrandMark({ className }: { className?: string }) {
  const maskId = `${useId()}-orbit-gap`;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="white" />
          <path d={MONOGRAM} stroke="black" strokeWidth="13" strokeLinecap="square" strokeLinejoin="miter" />
        </mask>
      </defs>
      <ellipse
        cx="50"
        cy="50"
        rx="46"
        ry="15"
        transform="rotate(-30 50 50)"
        stroke="var(--accent)"
        strokeWidth="1.4"
        mask={`url(#${maskId})`}
      />
      <circle cx="80.7" cy="23.6" r="2.8" fill="var(--accent)" />
      <path d={MONOGRAM} stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}
