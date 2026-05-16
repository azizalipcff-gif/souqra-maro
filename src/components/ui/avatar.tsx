import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string }
>(({ className, src, alt, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-lg",
      className
    )}
    {...props}
  >
    {src ? (
      <img
        src={src}
        alt={alt || "Avatar"}
        className="aspect-square h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-royal-blue text-white font-semibold">
        {alt?.[0]?.toUpperCase() || "U"}
      </div>
    )}
  </div>
))
Avatar.displayName = "Avatar"

export { Avatar }
