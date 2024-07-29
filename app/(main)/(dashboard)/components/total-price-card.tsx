type Props = {
  title: string;
  totalPrice: number;
};
export const TotalPriceCard = ({ title, totalPrice }: Props) => {
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-sm shadow-sm">
      <div className="text-xl font-semibold">{title}</div>
      <span className="text-xl">￥{totalPrice.toLocaleString()}</span>
    </div>
  );
};
