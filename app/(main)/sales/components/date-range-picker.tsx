"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { format as formatTz } from "date-fns-tz";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PopoverClose } from "@radix-ui/react-popover";

export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from: string =
    (searchParams.get("from") as string) ||
    formatTz(new Date(), "yyyy-MM-dd", { timeZone: "Asia/Tokyo" });
  const to: string =
    (searchParams.get("to") as string) ||
    formatTz(new Date(), "yyyy-MM-dd", { timeZone: "Asia/Tokyo" });
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(from),
    to: new Date(to),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy年MM月dd日")} -{" "}
                  {format(date.to, "yyyy年MM月dd日")}
                </>
              ) : (
                format(date.from, "yyyy年MM月dd日")
              )
            ) : (
              <span>日付の範囲を選択してください。</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2 flex flex-col gap-4"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <PopoverClose>
            <Button
              className="text-[16px] font-semibold"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());

                const from: string = formatTz(
                  new Date(date?.from!),
                  "yyyy-MM-dd",
                  { timeZone: "Asia/Tokyo" }
                );
                const to: string = formatTz(new Date(date?.to!), "yyyy-MM-dd", {
                  timeZone: "Asia/Tokyo",
                });
                console.log(from, to);
                params.set("from", from);
                params.set("to", to);
                params.delete("page");
                router.push(`${pathname}?${params.toString()}`, {
                  scroll: false,
                });
              }}
            >
              適用する
            </Button>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}
