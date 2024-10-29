type Props = {
  totalPrice: number;
};
export const TotalPrice = ({ totalPrice }: Props) => {
  return (
    <div className="text-xl flex items-center justify-end gap-2 border-b border-secondary-foreground pb-2">
      <span>合計</span>
      <div className="flex items-center gap-1">
        <div className="text-2xl font-semibold">
          {totalPrice.toLocaleString()}
        </div>
        <span className="text-lg">円</span>
      </div>
    </div>
  );
};
