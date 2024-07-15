"use client";

import { JapaneseYenIcon, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Sales } from "@/lib/types";

const chartConfig = {
  price: {
    icon: JapaneseYenIcon,
    label: "売上",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

type Props = {
  productName: string;
  chartData: { month: string; price: number }[];
};

export function YearSalesChart({ productName, chartData }: Props) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
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
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="price" fill="var(--color-price)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
