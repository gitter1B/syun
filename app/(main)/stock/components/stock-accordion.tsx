import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  storeId: string;
  storeName: string;
  children: React.ReactNode;
};
export const StockAccordion = ({ storeId, storeName, children }: Props) => {
  return (
    <Accordion type="single" defaultValue={storeId} collapsible>
      <AccordionItem value={storeId}>
        <AccordionTrigger className="px-2 text-lg font-semibold text-primary/80">
          {storeName}
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
