"use client";
import * as React from "react";

import { usePathname } from "next/navigation";

import { ProducerDTO } from "@/features/producers/lib/types";

import { extractProducerId } from "@/features/producers/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProducerCard } from "@/features/producers/components/producer-card";

type Props = {
  producers: ProducerDTO[];
};

export const ProducerSelect = ({ producers }: Props) => {
  const pathname = usePathname();
  const producerId: string = extractProducerId(pathname);
  const producerName: string =
    producers.find((producer) => producer.id === producerId)?.name || "";

  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="text-md font-semibold ">
          {producerName}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>生産者一覧</DialogTitle>
        <div className="grid grid-cols-2  gap-4">
          {producers.map((producer) => {
            return (
              <div key={producer.id} onClick={() => setOpen(false)}>
                <ProducerCard producer={producer} />
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
