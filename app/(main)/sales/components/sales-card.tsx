"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRightIcon, LineChartIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  productId?: string;
  productName: string;
  price: number;
  quantity: number;
};

export const SalesCard = ({
  productId,
  productName,
  price,
  quantity,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <Card className="flex flex-col gap-2 px-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] w-full font-semibold flex items-center justify-between truncate">
          {productName}
        </h2>
        <Button
          variant={"outline"}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());

            if (productId) {
              params.set("productId", productId);
            }

            router.push(`sales/details?${params.toString()}`, {
              scroll: false,
            });
          }}
        >
          <LineChartIcon className="mr-2" size={20} />
          詳細
        </Button>
      </div>
      <div className="grid grid-cols-2 text-[16px] gap-4">
        <div className="text-right">{quantity.toLocaleString()}袋</div>
        <div className="text-right">{price.toLocaleString()}円</div>
      </div>
    </Card>
  );
};
