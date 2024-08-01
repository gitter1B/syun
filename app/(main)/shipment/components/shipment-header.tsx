"use client";

import { Button } from "@/components/ui/button";
import { ShipmentDatePicker } from "./shipment-date-picker";
import { PlusIcon } from "lucide-react";
import { Product, Shipment, Store } from "@/lib/types";
import { ShipmentForm } from "./shipment-form";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ShipmentStoreSelect } from "./shipment-store-select";

type Props = {
  shipments: Shipment[];
  stores: Store[];
  products: Product[];
};
export const ShipmentHeader = ({ shipments, stores, products }: Props) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const existDates: Date[] = [
    ...new Set(shipments.map((item) => item.date)),
  ].map((item) => new Date(item));

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div className="flex gap-4">
          <ShipmentStoreSelect stores={stores} shipments={shipments} />
          <ShipmentDatePicker existDates={existDates} />
        </div>
        <Button
          variant={"secondary"}
          className="xl:hidden border"
          onClick={() => setFormOpen(!formOpen)}
        >
          <PlusIcon
            className={cn("mr transition-all", formOpen && "rotate-45")}
            size={20}
          />
          <span className="text-secondary-foreground ml-2 hidden min-[428px]:block ">
            {formOpen ? "閉じる" : "追加　"}
          </span>
        </Button>
      </div>
      <div className="xl:hidden">
        <Accordion
          type="single"
          collapsible
          value={formOpen ? "form" : ""}
          className="my-4"
        >
          <AccordionItem value="form">
            <AccordionContent>
              <ShipmentForm products={products} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
