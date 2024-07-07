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
  date: string;
};
export const ShipmentHeader = ({ shipments, stores, products }: Props) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div className="flex gap-4">
          <ShipmentStoreSelect stores={stores} shipments={shipments} />
          <ShipmentDatePicker shipments={shipments} />
        </div>
        <Button
          variant={"secondary"}
          className="xl:hidden border"
          onClick={() => setFormOpen(!formOpen)}
        >
          <PlusIcon
            className={cn("mr-2 transition-all", formOpen && "rotate-45")}
            size={20}
          />
          <span className="text-secondary-foreground">
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
