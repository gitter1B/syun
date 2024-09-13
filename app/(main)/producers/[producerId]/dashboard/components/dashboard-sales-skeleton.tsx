import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
export const DashboardSalesSkeleton = () => {
  return (
    <div className="space-y-2">
      <div className="flex justify-start">
        <Skeleton className="w-12 h-8 rounded-md" />
      </div>
      <Separator />
      <div className="grid sm:grid-cols-3 gap-4">
        <Skeleton className="w-full h-24 rounded-md" />
        <Skeleton className="w-full h-24 rounded-md" />
        <Skeleton className="w-full h-24 rounded-md" />
      </div>
    </div>
  );
};
