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
import { format } from "date-fns-tz";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  resetPage?: boolean;
};
export const YearSelect = ({ resetPage }: Props) => {
  const thisYear: string = format(new Date(), "yyyy", {
    timeZone: "Asia/Tokyo",
  });
  const years: string[] = Array.from({ length: Number(thisYear) - 2021 }).map(
    (_, i) => (2022 + i).toString()
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const yearParam = searchParams.get("year")!;
  const defaultValue: string = years.includes(yearParam) ? yearParam : thisYear;

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("year", value);
        if (resetPage) params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="年を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {years.map((year) => {
            return (
              <SelectItem key={year} value={year}>
                {year}年
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
