"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
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
    </div>
  )
} 