"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}

export function Rating({
  value,
  onChange,
  readOnly = false,
  size = "md",
  className,
  ...props
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating)
    }
  }

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHoverValue(rating)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null)
    }
  }

  const displayValue = hoverValue ?? value

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={cn(
            "relative",
            size === "sm" && "w-4 h-4",
            size === "md" && "w-6 h-6",
            size === "lg" && "w-8 h-8"
          )}
          onClick={() => handleClick(rating)}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
          disabled={readOnly}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn(
              "w-full h-full",
              rating <= displayValue
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            )}
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ))}
    </div>
  )
} 