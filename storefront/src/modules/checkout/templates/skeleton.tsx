import { Skeleton } from "@medusajs/ui"

export default function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-y-8">
      <div className="border p-4 rounded-sm bg-ui-bg-interactive">
        <Skeleton className="w-2/5 h-6" />
        <Skeleton className="w-4/5 h-4 mt-4" />
        <Skeleton className="w-4/5 h-4 mt-2" />
        <Skeleton className="w-2/5 h-4 mt-2" />
      </div>
      <div className="border p-4 rounded-sm bg-ui-bg-interactive">
        <Skeleton className="w-2/5 h-6" />
        <Skeleton className="w-4/5 h-4 mt-4" />
        <Skeleton className="w-4/5 h-4 mt-2" />
        <Skeleton className="w-2/5 h-4 mt-2" />
      </div>
      <div className="border p-4 rounded-sm bg-ui-bg-interactive">
        <Skeleton className="w-2/5 h-6" />
        <Skeleton className="w-4/5 h-4 mt-4" />
        <Skeleton className="w-4/5 h-4 mt-2" />
        <Skeleton className="w-2/5 h-4 mt-2" />
      </div>
    </div>
  )
}
