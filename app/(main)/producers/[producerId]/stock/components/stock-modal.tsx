"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stock } from "@/lib/types";
import { Loader2Icon, PackageXIcon } from "lucide-react";
import { ChangeEvent, MouseEvent, useState, useTransition } from "react";
import * as React from "react";
import { format, formatInTimeZone } from "date-fns-tz";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn, extractProducerId } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createWaste } from "@/lib/actions/waste";
import { usePathname } from "next/navigation";

type Props = {
  stock: Stock;
};
export const StockModal = ({ stock }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd"))
  );
  const [quantity, setQuantity] = useState<string>("1");
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const handleCountChange = (e: MouseEvent<HTMLButtonElement>) => {
    const addValue: number = Number(e.currentTarget.value);
    setQuantity((prev) => {
      const prevNumber: number = Number(prev);

      if (prevNumber + addValue <= 1) {
        return "1";
      } else if (prevNumber + addValue >= stock.quantity) {
        return stock.quantity.toString();
      } else {
        return (prevNumber + addValue).toString();
      }
    });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setQuantity("1");
      }}
    >
      <DialogTrigger asChild>
        <div className="w-full">
          <Button variant={"outline"} className="hidden sm:inline-flex">
            <PackageXIcon className="mr-2" size={20} />
            <span className="font-semibold">回収/廃棄</span>
          </Button>
          <Button variant={"outline"} size={"icon"} className="sm:hidden">
            <PackageXIcon size={20} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stock.productName}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Label>回収/廃棄日付</Label>
        <Popover
          modal={true}
          open={datePickerOpen}
          onOpenChange={setDatePickerOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "yyyy年MM月dd日")
              ) : (
                <span>日付を選択してください。</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date: Date | undefined) => {
                setDate(date);
                setDatePickerOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Label>回収/廃棄数</Label>
        <div className="flex items-center gap-3">
          <Input
            className="text-right text-[16px]"
            value={quantity?.toString()}
            inputMode="numeric"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const regex = /^\d*$/;
              const value: string = e.target.value;
              setQuantity((prev) => {
                if (!regex.test(value)) {
                  return prev;
                } else {
                  return value;
                }
              });
            }}
          />
          <span className="text-lg">袋</span>
        </div>
        <div className="grid grid-cols-6 gap-2 items-center">
          <Button variant={"secondary"} onClick={() => setQuantity("1")}>
            1
          </Button>
          <Button variant={"secondary"} value={-10} onClick={handleCountChange}>
            -10
          </Button>
          <Button variant={"secondary"} value={-1} onClick={handleCountChange}>
            -1
          </Button>
          <Button variant={"secondary"} value={1} onClick={handleCountChange}>
            +1
          </Button>
          <Button variant={"secondary"} value={10} onClick={handleCountChange}>
            +10
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => setQuantity(stock.quantity.toString())}
          >
            最大
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              startTransition(async () => {
                const producerId: string = extractProducerId(pathname);
                await createWaste(
                  producerId,
                  date ? format(date, "yyyy-MM-dd") : "",
                  quantity,
                  stock
                );
                setOpen(false);
              });
            }}
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="mr-2 animate-spin" />}
            修正する
          </Button>
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            キャンセル
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
