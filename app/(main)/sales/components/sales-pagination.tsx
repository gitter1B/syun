"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type Props = {
  maxPage: number;
};

export const SalesPagination = ({ maxPage }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page: number = Number(searchParams.get("page")) || 1;
  const params = new URLSearchParams(searchParams.toString());
  return (
    <div className="sticky top-full flex items-center justify-center gap-4 min-h-8 p-4 md:px-8">
      <Button
        variant={"outline"}
        disabled={page <= 1}
        onClick={() => {
          params.set("page", (page - 1).toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <ArrowLeftIcon className="mr-2" size={20} /> 前のページ
      </Button>
      {page}
      <Button
        variant={"outline"}
        disabled={maxPage <= page}
        onClick={() => {
          params.set("page", (page + 1).toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        次のページ <ArrowRightIcon className="ml-2" size={20} />
      </Button>
    </div>
  );
};
