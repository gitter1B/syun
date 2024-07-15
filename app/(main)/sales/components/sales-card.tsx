"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns-tz";
import { Button } from "@/components/ui/button";

type Props = {
  productId: string;
  productName: string;
  totalPrice: number;
  totalQuantity: number;
};

export const SalesCard = ({
  productId,
  productName,
  totalPrice,
  totalQuantity,
}: Props) => {
  const thisYear: string = format(new Date(), "yyyy", {
    timeZone: "Asia/Tokyo",
  });
  const years: string[] = Array.from({ length: Number(thisYear) - 2020 }).map(
    (_, i) => (2021 + i).toString()
  );
  const months: string[] = Array.from({ length: 13 }).map((_, i) =>
    i.toString()
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const year: string = searchParams.get("year") || thisYear;
  const monthParam = searchParams.get("month")!;
  const month: string = months.includes(monthParam) ? monthParam : "0";

  return (
    <Card className="flex flex-col gap-4 px-4 p-4 ">
      <h2 className="text-[20px] w-full font-semibold flex items-center truncate">
        {productName}
      </h2>
      <div className="grid grid-cols-2 text-[16px]">
        <div className="text-right">{totalQuantity.toLocaleString()}袋</div>
        <div className="text-right">{totalPrice.toLocaleString()}円</div>
        <Button
          variant={"secondary"}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("year", year);
            params.set("month", month);
            router.push(`/sales/detail/${productId}?${params.toString()}`);
          }}
        >
          詳細ページへ
        </Button>
      </div>
    </Card>
  );
};
