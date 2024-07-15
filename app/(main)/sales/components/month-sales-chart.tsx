"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { JapaneseYenIcon } from "lucide-react";

const chartConfig = {
  price: {
    icon: JapaneseYenIcon,
    label: "売上",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

type Props = {
  productName: string;
  chartData: { day: string; price: number }[];
};
export function MonthSalesChart({ productName, chartData }: Props) {
  return (
    <ChartContainer config={chartConfig} className="w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickFormatter={(value) => {
            return value >= 10000
              ? `${(value / 10000).toLocaleString()}万円`
              : `${value.toLocaleString()}円`;
          }}
        />
        <Bar dataKey="price" fill="var(--color-price)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
