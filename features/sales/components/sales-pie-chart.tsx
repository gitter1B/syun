"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, LabelList, Pie, PieChart, Tooltip } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  chartData: { productName: string; price: number; fill: string }[];
};
export function SalesPieChart({ chartData }: Props) {
  const totalPrice: number = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.price, 0);
  }, [chartData]);

  const chartConfig: ChartConfig = convertPieChartDataToConfig(chartData);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px] "
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                      style={
                        {
                          "--color-bg": `var(--color-${name})`,
                        } as React.CSSProperties
                      }
                    />
                    {name}
                  </div>
                  <span className="text-right">{value.toLocaleString()}円</span>
                </div>
              )}
            />
          }
        />
        <Pie
          data={chartData}
          dataKey="price"
          nameKey="productName"
          innerRadius={40}
          strokeWidth={5}
        >
          <LabelList
            dataKey="productName"
            className="fill-background"
            stroke="none"
            fontSize={12}
            formatter={(value: keyof typeof chartConfig) => {
              return `${chartConfig[value]?.label}`;
            }}
          />
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalPrice.toLocaleString()}円
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-foreground text-xl font-semibold"
                    >
                      売上
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export function convertPieChartDataToConfig(
  pieChartData: { productName: string; price: number; fill: string }[]
) {
  const testChartConfig: ChartConfig = Object.fromEntries(
    pieChartData.map((item, index) => {
      return [
        item.productName,
        { label: item.productName, color: `hsl(var(--chart-${index + 1}))` },
      ];
    })
  );

  return testChartConfig;
}
