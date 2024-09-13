import { ChartsSheet } from "./charts-sheet";

type Props = {
  title: string;
  totalPrice: number;
  barChartData?: { date: string; price: number }[];
  pieChartData?: {
    productName: string;
    price: number;
    fill: string;
  }[];
};
export const TotalPriceCard = ({
  title,
  totalPrice,
  barChartData,
  pieChartData,
}: Props) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-sm shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">{title}</div>
        <span className="text-xl">￥{totalPrice.toLocaleString()}</span>
      </div>
      <div>
        <ChartsSheet
          title={title}
          barChartData={barChartData}
          pieChartData={pieChartData}
        />
      </div>
    </div>
  );
};
