import { Skeleton } from "./ui/skeleton"

export default function LoadingSkeleton() {
  const count = 8
  const arr = Array.from({ length: count }, (_, i) => (
    <Skeleton key={i} className="h-[20px] w-full rounded-full" />
  ))

  return (
    <div className="container flex flex-col gap-3">
      <div className="flex">
        <Skeleton className="h-[20px] w-2/5 rounded-full" />

        <div className="flex-1" />

        <Skeleton className="h-[20px] w-1/12 rounded-full" />
      </div>
      {arr}
      <div className="flex gap-2">
        <Skeleton className="h-[20px] w-1/12 rounded-full" />

        <div className="flex-1" />

        <Skeleton className="h-[20px] w-1/12 rounded-full" />
        <Skeleton className="h-[20px] w-1/12 rounded-full" />
      </div>
    </div>
  )
}
