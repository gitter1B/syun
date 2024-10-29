"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { format, formatInTimeZone } from "date-fns-tz";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  name: string;
};

export function DatePicker({ name }: Props) {
  const searchParams = useSearchParams();
  const selectedDate = new Date(
    searchParams.get(name) ||
      (formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd") as string)
  );
  const [date, setDate] = React.useState<Date>(selectedDate);
  const [open, setOpen] = React.useState<boolean>(false);
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-auto justify-start text-left",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2" size={16} />
          {selectedDate ? (
            format(selectedDate, "yyyy年MM月dd日")
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
          onSelect={(value) => {
            if (value) {
              const params = new URLSearchParams(searchParams.toString());
              params.set(name, format(value, "yyyy-MM-dd"));
              params.delete("page");
              setDate(value);
              router.replace(`?${params.toString()}`);
            }
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
