"use client"

import * as React from "react"
<<<<<<< HEAD
import { cn } from "@/lib/utils"

interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
=======
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
>>>>>>> ae0d77a (FIX ERROS)
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
<<<<<<< HEAD
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
=======
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null)
  const [isHovering, setIsHovering] = React.useState(false)

  const handleClick = (newValue: number) => {
    if (readOnly) return
    if (newValue === value) {
      onChange?.(0)
    } else {
      onChange?.(newValue)
    }
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setHoveredValue(null)
      }}
      {...props}
    >
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isActive = isHovering
          ? hoveredValue !== null && starValue <= hoveredValue
          : starValue <= value

        return (
          <button
            key={starValue}
            type="button"
            className={cn(
              "text-muted-foreground hover:text-primary transition-colors",
              isActive && "text-primary fill-primary"
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHoveredValue(starValue)}
            disabled={readOnly}
            aria-label={`Avaliar com ${starValue} ${starValue === 1 ? "estrela" : "estrelas"}`}
          >
            <Star className={sizeClasses[size]} />
          </button>
        )
      })}
      {!readOnly && value > 0 && (
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-primary transition-colors ml-2"
          onClick={() => onChange?.(0)}
          aria-label="Limpar avaliação"
        >
          Limpar
        </button>
      )}
>>>>>>> ae0d77a (FIX ERROS)
    </div>
  )
} 