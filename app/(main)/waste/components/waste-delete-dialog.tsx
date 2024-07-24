"use client";
import { deleteWaste } from "@/actions/waste";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WasteItem } from "@/lib/types";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { MouseEvent, useState, useTransition } from "react";

type Props = {
  wasteItem: WasteItem;
};

export const WasteDeleteDialog = ({ wasteItem }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <div className="flex gap-2">
          <Trash2Icon size={20} />
          削除
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>削除しますか？</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              startTransition(async () => {
                await deleteWaste(wasteItem.id);
                setOpen(false);
              });
            }}
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="mr-2 animate-spin" />}
            {isPending ? "削除しています..." : "削除する"}
          </Button>
          <DialogClose asChild>
            <Button variant={"outline"}>閉じる</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
