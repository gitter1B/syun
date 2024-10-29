import { Product } from "@/features/products/lib/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  product: Product;
  totalQuantity: number;
  totalPrice: number;
  details: {
    unitPrice: number;
    totalQuantity: number;
    totalPrice: number;
  }[];
};

export const SalesListItem = ({
  product,
  totalPrice,
  totalQuantity,
  details,
}: Props) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={product.id}>
        <AccordionTrigger className="hover:no-underline">
          <div className="grid grid-cols-[1fr_200px] justify-between w-full mr-2">
            <div className="text-lg font-semibold truncate text-left">
              {product.name}
            </div>
            <div className="flex justify-end">
              <div className="w-20 flex items-center justify-end">
                <div className="text-lg font-semibold">{totalQuantity}</div>
                <span>袋</span>
              </div>
              <div className="w-28 flex items-center justify-end">
                <div className="text-lg font-semibold">
                  {totalPrice.toLocaleString()}
                </div>
                <span>円</span>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4 px-6">
            <div className="flex items-center justify-end text-right">
              <div className="w-28">単価</div>
              <div className="w-28">個数</div>
              <div className="w-28">合計</div>
            </div>
            {details.map(({ unitPrice, totalPrice, totalQuantity }) => {
              return (
                <div
                  key={product.id + unitPrice + totalPrice}
                  className="flex items-center justify-end"
                >
                  <div className="flex items-center justify-end w-28">
                    <div className="text-base">
                      {unitPrice.toLocaleString()}
                    </div>
                    <span>円</span>
                  </div>
                  <div className="flex items-center justify-end w-28">
                    <div className="text-base">
                      {totalQuantity.toLocaleString()}
                    </div>
                    <span>袋</span>
                  </div>
                  <div className="flex items-center justify-end w-28">
                    <div className="text-base">
                      {totalPrice.toLocaleString()}
                    </div>
                    <span>円</span>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
