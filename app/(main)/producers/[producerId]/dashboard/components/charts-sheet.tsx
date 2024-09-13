import { SalesBarChart } from "@/app/(main)/components/sales-bar-chart";
import { SalesPieChart } from "@/app/(main)/components/sales-pie-chart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LineChartIcon } from "lucide-react";

type Props = {
  title: string;
  barChartData?: { date: string; price: number }[];
  pieChartData?: {
    productName: string;
    price: number;
    fill: string;
  }[];
};
export const ChartsSheet = ({ title, barChartData, pieChartData }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <LineChartIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        {barChartData && <SalesBarChart chartData={barChartData} />}
        {pieChartData && <SalesPieChart chartData={pieChartData} />}
      </SheetContent>
    </Sheet>
  );
};