import { cn } from "@/lib/utils"

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: "shimmer 1.5s infinite",
      }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <LoadingSkeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton className="h-8 w-full" />
      </div>
    </div>
  )
}
