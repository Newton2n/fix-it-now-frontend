"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { AdminDashboardData } from "@/types/stats";

type OverviewData =
  AdminDashboardData["overview"];

type AdminUserCompositionChartProps = {
  overview: OverviewData;
};

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function AdminUserCompositionChart({
  overview,
}: AdminUserCompositionChartProps) {
  const chartData = [
    {
      role: "Customers",
      users: overview.customerCount,
      fill: "var(--chart-2)",
    },
    {
      role: "Technicians",
      users: overview.technicianCount,
      fill: "var(--chart-4)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Composition</CardTitle>

        <CardDescription>
          Current customers and technicians on the platform.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[320px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 12,
              left: 12,
              bottom: 10,
            }}
          >
            <CartesianGrid horizontal={false} />

            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              type="category"
              dataKey="role"
              tickLine={false}
              axisLine={false}
              width={85}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />

            <Bar
              dataKey="users"
              radius={[0, 5, 5, 0]}
              barSize={42}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.role}
                  fill={entry.fill}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}