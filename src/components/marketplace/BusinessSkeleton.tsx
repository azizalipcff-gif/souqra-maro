import { Card, CardContent } from '@/components/ui/card'

export function BusinessSkeleton() {
  return (
    <Card className="overflow-hidden h-full border border-gray-100">
      <div className="h-36 bg-gray-200 animate-pulse" />
      <CardContent className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
      </CardContent>
    </Card>
  )
}
