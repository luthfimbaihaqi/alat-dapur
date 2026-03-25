import { forwardRef } from "react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
//  INPUT COMPONENT
// ─────────────────────────────────────────────
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 text-stone-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input",
              leftIcon  && "pl-9",
              rightIcon && "pr-9",
              error     && "input-error",
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 text-stone-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}

        {/* Hint text */}
        {!error && hint && (
          <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input


// ─────────────────────────────────────────────
//  TEXTAREA COMPONENT
// ─────────────────────────────────────────────
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "input resize-none min-h-[100px]",
            error && "input-error",
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
        {!error && hint && (
          <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"


// ─────────────────────────────────────────────
//  SELECT COMPONENT
// ─────────────────────────────────────────────
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, hint, options, placeholder, id, ...props },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5">*</span>
            )}
          </label>
        )}

        <select
          ref={ref}
          id={inputId}
          className={cn(
            "input appearance-none cursor-pointer",
            error && "input-error",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
        {!error && hint && (
          <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"