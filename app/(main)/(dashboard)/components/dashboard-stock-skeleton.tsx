import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
export const DashboardStockSkeleton = () => {
  return (
    <div>
      <div className="space-y-2">
        <div className="flex justify-start">
          <Skeleton className="w-12 h-8 rounded-md" />
        </div>
        <Separator />
        <Skeleton className="w-60 h-10 rounded-md" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, index) => {
            return <Skeleton key={index} className=" h-24" />;
          })}
        </div>
      </div>
    </div>
  );
};
