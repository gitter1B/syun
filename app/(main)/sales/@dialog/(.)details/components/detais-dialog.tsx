"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};
export const DetailsDialog = ({ children }: Props) => {
  const router = useRouter();
  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        router.back();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
