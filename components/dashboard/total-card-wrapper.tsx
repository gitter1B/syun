// import { getTotalCardData } from "@/lib/data/dashboard";
// import { TotalCard } from "@/components/dashboard/total-card";

// type Props = {
//   producerId: string;
// };
// export const TotalCardWrapper = async ({ producerId }: Props) => {
//   const { todayPriceCardData, monthPriceCardData, yearPriceCardData } =
//     await getTotalCardData(producerId);

//   return (
//     <div className="flex flex-col gap-2">
//       <h1 className="text-xl font-semibold w-full border-b pb-1">集計</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <TotalCard {...todayPriceCardData} />
//         <TotalCard {...monthPriceCardData} />
//         <TotalCard {...yearPriceCardData} />
//       </div>
//     </div>
//   );
// };
