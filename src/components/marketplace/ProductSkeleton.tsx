import { Card, CardContent } from '@/components/ui/card'

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden h-full border border-gray-100">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <CardContent className="p-5">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/2" />
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-1/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
      </CardContent>
    </Card>
  )
}
