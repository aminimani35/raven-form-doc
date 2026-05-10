"use client";

import React, { memo } from "react";
import { cn } from "../utils/cn";

// ─── Inline SVG loading spinner (no external icons dep) ───────────────────────
export const Spinner = memo<{ className?: string }>(({ className }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
));
Spinner.displayName = "Spinner";

// ─── Button variant helpers ───────────────────────────────────────────────────
type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent",
  outline:
    "border border-input bg-background hover:bg-muted/50 text-foreground",
  ghost: "border-transparent hover:bg-muted/50 text-foreground",
  destructive:
    "bg-destructive text-white hover:bg-destructive/90 border-transparent",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 h-8",
  md: "text-sm px-4 py-2 h-9",
  lg: "text-sm px-6 py-2.5 h-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

/**
 * Minimal styled button used internally by RavenForm, RavenWizardForm,
 * and RavenRepeaterField. Relies on Tailwind CSS utilities available in
 * the consumer's project.
 *
 * To customise appearance, pass `className` — it is appended after defaults.
 */
export const Button = memo<ButtonProps>(
  ({
    variant = "default",
    size = "md",
    loading,
    disabled,
    children,
    className,
    ...props
  }: ButtonProps) => (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClass[variant ?? "default"],
        sizeClass[size ?? "md"],
        className,
      )}
    >
      {loading && <Spinner className="w-3.5 h-3.5 me-1" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
