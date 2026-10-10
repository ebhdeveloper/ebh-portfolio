import type { ComponentProps } from "react";

export function ArrowIcon(props: ComponentProps<"svg">) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
