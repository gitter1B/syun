import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center p-4 sm:p-8">
      <Loader2Icon className="animate-spin" size={60} />
    </div>
  );
}
