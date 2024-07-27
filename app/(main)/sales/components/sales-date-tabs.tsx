"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns-tz";
import { useRouter, useSearchParams } from "next/navigation";
import { subMonths } from "date-fns";

export const SalesDateTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") as string;
  const to = searchParams.get("to") as string;
  return (
    <div className="flex gap-2">
      <Button
        asChild
        variant={"outline"}
        onClick={() => {
          router;
        }}
      >
        <Link href={"/sales"}>今日</Link>
      </Button>
      <Button asChild variant={"outline"}>
        <Link href={""}>今月</Link>
      </Button>
      <Button asChild variant={"outline"}>
        {/* <Link href={`/sales?from=${thisYear}-01-01&to${thisYear}-12-31`}> 今年
        </Link> */}
      </Button>
    </div>
  );
};
