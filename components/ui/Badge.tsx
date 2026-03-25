import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
//  BADGE VARIANTS
// ─────────────────────────────────────────────
const variants = {
  warm:     "bg-warm-100 text-warm-700",
  featured: "bg-warm-700 text-cream",
  active:   "bg-green-100 text-green-700",
  inactive: "bg-stone-200 text-stone-600",
  info:     "bg-blue-100 text-blue-700",
  danger:   "bg-red-100 text-red-600",
}

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
export interface BadgeProps {
  variant?: keyof typeof variants
  className?: string
  children: React.ReactNode
}

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function Badge({
  variant = "warm",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-2xs font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}