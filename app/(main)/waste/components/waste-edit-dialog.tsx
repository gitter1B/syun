import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Waste } from "@/lib/types";
import { EditIcon, Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { WasteSchema } from "@/schemas";
import { updateWaste } from "@/lib/actions/waste";

type Props = {
  wasteItem: Waste;
};

export const WasteEditDialog = ({ wasteItem }: Props) => {
  const form = useForm<z.infer<typeof WasteSchema>>({
    resolver: zodResolver(WasteSchema),
    defaultValues: {
      date: new Date(wasteItem.date),
      quantity: wasteItem.quantity.toString(),
    },
  });

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);

  function onSubmit(values: z.infer<typeof WasteSchema>) {
    startTransition(async () => {
      await updateWaste(values, wasteItem.id);
      setOpen(false);
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <div className="flex gap-2">
          <EditIcon size={20} />
          修正
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>回収／廃棄修正</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>日付</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy年MM月dd日")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>数量</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="数量を入力してください。"
                        {...field}
                        className="text-[16px] w-[240px]"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const regex = /^\d*$/;
                          const value: string = e.target.value;
                          if (regex.test(value)) {
                            field.onChange(e);
                          }
                        }}
                        inputMode="numeric"
                      />

                      <span className="text-lg font-medium">袋</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="mr-2 animate-spin" />}
                {isPending ? "修正しています..." : "修正する"}
              </Button>
              <DialogClose asChild>
                <Button variant={"outline"}>閉じる</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
