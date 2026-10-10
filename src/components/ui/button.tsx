import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  size?: "default" | "icon";
};

export function Button({
  variant = "primary",
  size = "default",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      data-variant={variant}
      data-size={size}
      className={`ui-button ${className}`.trim()}
    />
  );
}
