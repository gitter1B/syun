// import { ChartsSheet } from "./charts-sheet";

type Props = {
  title: string;
  totalPrice: number;
  // barChartData?: { date: string; price: number }[];
  // pieChartData?: {
  //   productName: string;
  //   price: number;
  //   fill: string;
  // }[];
};
export const TotalCard = ({
  title,
  totalPrice,
}: // barChartData,
// pieChartData,
Props) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-sm shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="text-md">{title}</div>
        <div className="flex items-end gap-1">
          <div className="text-2xl font-semibold">
            {totalPrice.toLocaleString()}
          </div>
          <span className="text-lg">円</span>
        </div>
      </div>
      <div>
        {/* <ChartsSheet
          title={title}
          barChartData={barChartData}
          pieChartData={pieChartData}
        /> */}
      </div>
    </div>
  );
};
