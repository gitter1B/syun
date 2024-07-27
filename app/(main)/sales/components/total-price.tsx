type Props = {
  totalPrice: number;
};
export const TotalPrice = ({ totalPrice }: Props) => {
  return (
    <div className="text-xl flex justify-end gap-4 border-b border-secondary-foreground pb-2">
      <span>合計</span>
      <div>{totalPrice.toLocaleString()}円</div>
    </div>
  );
};
