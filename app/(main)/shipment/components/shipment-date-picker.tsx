"use client";

import * as React from "react";
import { format } from "date-fns-tz";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Shipment } from "@/lib/types";

type Props = {
  shipments: Shipment[];
};

export function ShipmentDatePicker({ shipments }: Props) {
  const searchParams = useSearchParams();
  const selectedDate = new Date(
    searchParams.get("date") ||
      (format(new Date(), "yyyy-MM-dd", { timeZone: "Asia/Tokyo" }) as string)
  );
  const existDates: Date[] = shipments.map((item) => new Date(item.date));
  const [date, setDate] = React.useState<Date>(selectedDate);
  const [open, setOpen] = React.useState<boolean>(false);
  const router = useRouter();
  const isTablet = useMediaQuery("(min-width: 420px)");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, isTablet ? "yyyy年MM月dd日" : "MM月dd日")
          ) : (
            <span>日付を選択してください。</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          modifiers={{ exist: existDates }}
          modifiersClassNames={{
            exist: cn("text-primary border-2 border-primary"),
          }}
          onSelect={(value) => {
            if (value) {
              const params = new URLSearchParams(window.location.search);
              params.set("date", format(value, "yyyy-MM-dd"));
              setDate(value);
              router.push(`?${params.toString()}`);
            }
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
