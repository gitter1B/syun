"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  resetPage?: boolean;
};
export const MonthSelect = ({ resetPage }: Props) => {
  const months: string[] = Array.from({ length: 13 }).map((_, i) =>
    i.toString()
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const monthParam = searchParams.get("month")!;
  const defaultValue: string = months.includes(monthParam) ? monthParam : "0";

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("month", value);
        if (resetPage) params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="月を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {months.map((month) => {
            return (
              <SelectItem key={month} value={month}>
                {month === "0" ? "全ての月" : `${month}月`}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
