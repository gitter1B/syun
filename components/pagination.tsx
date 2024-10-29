"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  totalPages: number;
};

export const Pagination = ({ totalPages }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page: number = Number(searchParams.get("page")) || 1;
  const params = new URLSearchParams(searchParams.toString());
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <Button
        variant={"ghost"}
        onClick={() => {
          params.set("page", (page - 1).toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
        disabled={page <= 1}
      >
        前のページ
      </Button>
      <span>{page}</span>
      <Button
        variant={"ghost"}
        onClick={() => {
          params.set("page", (page + 1).toString());
          router.push(`${pathname}?${params.toString()}`);
        }}
        disabled={page >= totalPages}
      >
        次のページ
      </Button>
    </div>
  );
};
