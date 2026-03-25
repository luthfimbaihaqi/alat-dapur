import { forwardRef } from "react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
//  BUTTON VARIANTS & SIZES
// ─────────────────────────────────────────────
const variants = {
  primary: "bg-warm-700 text-cream hover:bg-warm-900 focus-visible:ring-warm-300",
  outline: "border border-warm-300 text-warm-700 bg-transparent hover:bg-warm-50 focus-visible:ring-warm-300",
  ghost:   "text-stone-600 bg-transparent hover:bg-warm-50 focus-visible:ring-warm-300",
  danger:  "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-300",
  wa:      "text-white focus-visible:ring-green-300",
}

const sizes = {
  sm:   "px-3.5 py-1.5 text-xs gap-1.5",
  md:   "px-5 py-2.5 text-sm gap-2",
  lg:   "px-6 py-3 text-base gap-2",
  icon: "p-2",
}

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isWa = variant === "wa"

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-lg font-sans font-medium",
          "transition-all duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:pointer-events-none",
          // Variant & size
          variants[variant],
          sizes[size],
          // WA button warna khusus via inline style
          isWa && "bg-[#25D366] hover:bg-[#1aab52]",
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="shrink-0">{leftIcon}</span>
        )}

        {/* Label */}
        {children}

        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button