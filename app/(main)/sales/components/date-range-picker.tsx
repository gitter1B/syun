"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
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
  const [open, setOpen] = React.useState<boolean>(false);
  const today: Date = new Date();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from: string =
    (searchParams.get("from") as string) || format(today, "yyyy-MM-dd");
  const to: string =
    (searchParams.get("to") as string) || format(today, "yyyy-MM-dd");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(from),
    to: new Date(to),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
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
          className="w-auto p-4 flex flex-col gap-4"
          align="start"
        >
          <div className="flex gap-4">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              className="border rounded-sm"
            />
            <div className="flex flex-col gap-2">
              <Button
                variant={"outline"}
                onClick={() => setDate({ from: today, to: today })}
              >
                今日
              </Button>
              <Button
                variant={"outline"}
                onClick={() =>
                  setDate({
                    from: new Date(today.getFullYear(), today.getMonth(), 1),
                    to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
                  })
                }
              >
                今月
              </Button>
              <Button
                variant={"outline"}
                onClick={() =>
                  setDate({
                    from: new Date(today.getFullYear(), 0, 1),
                    to: new Date(today.getFullYear(), 11, 31),
                  })
                }
              >
                今年
              </Button>
              <Button
                variant={"outline"}
                onClick={() =>
                  setDate({
                    from: new Date(
                      today.getFullYear(),
                      today.getMonth() - 1,
                      1
                    ),
                    to: new Date(today.getFullYear(), today.getMonth(), 0),
                  })
                }
              >
                前月
              </Button>
              <Button
                variant={"outline"}
                onClick={() =>
                  setDate({
                    from: new Date(today.getFullYear() - 1, 0, 1),
                    to: new Date(today.getFullYear() - 1, 11, 31),
                  })
                }
              >
                前年
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="text-[16px] font-semibold"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());

                const from: string = format(
                  new Date(date?.from!),
                  "yyyy-MM-dd"
                );
                const to: string = format(new Date(date?.to!), "yyyy-MM-dd");
                params.set("from", from);
                params.set("to", to);
                params.delete("page");
                router.push(`${pathname}?${params.toString()}`, {
                  scroll: false,
                });
                setOpen(false);
              }}
            >
              適用する
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
