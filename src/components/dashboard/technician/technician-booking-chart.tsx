"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { TechnicianDashboardData } from "@/types/stats";

type TechnicianOverview =
  TechnicianDashboardData["overview"];

type TechnicianBookingChartProps = {
  overview: TechnicianOverview;
};

const barChartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  canceled: {
    label: "Canceled",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function TechnicianBookingChart({
  overview,
}: TechnicianBookingChartProps) {
  const barData = [
    {
      status: "Pending",
      bookings: overview.pendingBookings,
      fill: "var(--chart-1)",
    },
    {
      status: "Completed",
      bookings: overview.completedBookings,
      fill: "var(--chart-2)",
    },
    {
      status: "Canceled",
      bookings: overview.canceledBookings,
      fill: "var(--chart-3)",
    },
  ];

  const pieData = [
    {
      status: "pending",
      label: "Pending",
      value: overview.pendingBookings,
      fill: "var(--chart-1)",
    },
    {
      status: "completed",
      label: "Completed",
      value: overview.completedBookings,
      fill: "var(--chart-2)",
    },
    {
      status: "canceled",
      label: "Canceled",
      value: overview.canceledBookings,
      fill: "var(--chart-3)",
    },
  ];

  const totalBookings =
    overview.pendingBookings +
    overview.completedBookings +
    overview.canceledBookings;

  return (
    <div className="grid gap-6">
      {/* Booking performance bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Performance</CardTitle>

          <CardDescription>
            Compare your current booking results.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer
            config={barChartConfig}
            className="h-[280px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={barData}
              margin={{
                top: 10,
                right: 12,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="status"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={35}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />

              <Bar
                dataKey="bookings"
                radius={[5, 5, 0, 0]}
              >
                {barData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Booking distribution pie chart */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Distribution</CardTitle>

          <CardDescription>
            Understand the proportion of each booking state.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {totalBookings === 0 ? (
            <EmptyBookingChart />
          ) : (
            <ChartContainer
              config={pieChartConfig}
              className="mx-auto h-[280px] w-full max-w-md"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="label"
                    />
                  }
                />

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="var(--background)"
                  strokeWidth={3}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={entry.fill}
                    />
                  ))}
                </Pie>

                <ChartLegend
                  content={<ChartLegendContent />}
                />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyBookingChart() {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed bg-muted/20 px-4 text-center">
      <div>
        <p className="font-medium">
          No booking data available
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Booking distribution will appear here when data is available.
        </p>
      </div>
    </div>
  );
}