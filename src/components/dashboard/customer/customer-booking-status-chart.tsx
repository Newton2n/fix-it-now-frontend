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

import type { CustomerDashboardData } from "@/types/stats";

type CustomerOverview =
  CustomerDashboardData["overview"];

type CustomerBookingStatusChartProps = {
  overview: CustomerOverview;
};

const barChartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  requested: {
    label: "Requested",
    color: "var(--chart-1)",
  },
  accepted: {
    label: "Accepted",
    color: "var(--chart-2)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-4)",
  },
  canceled: {
    label: "Canceled",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function CustomerBookingStatusChart({
  overview,
}: CustomerBookingStatusChartProps) {
  const barData = [
    {
      status: "Requested",
      bookings: overview.requestedBookings,
      fill: "var(--chart-1)",
    },
    {
      status: "Accepted",
      bookings: overview.acceptedBookings,
      fill: "var(--chart-2)",
    },
    {
      status: "Completed",
      bookings: overview.completedBookings,
      fill: "var(--chart-4)",
    },
    {
      status: "Canceled",
      bookings: overview.canceledBookings,
      fill: "var(--chart-3)",
    },
  ];

  const pieData = [
    {
      status: "requested",
      label: "Requested",
      value: overview.requestedBookings,
      fill: "var(--chart-1)",
    },
    {
      status: "accepted",
      label: "Accepted",
      value: overview.acceptedBookings,
      fill: "var(--chart-2)",
    },
    {
      status: "completed",
      label: "Completed",
      value: overview.completedBookings,
      fill: "var(--chart-4)",
    },
    {
      status: "canceled",
      label: "Canceled",
      value: overview.canceledBookings,
      fill: "var(--chart-3)",
    },
  ];

  const totalBookings =
    overview.requestedBookings +
    overview.acceptedBookings +
    overview.completedBookings +
    overview.canceledBookings;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Performance</CardTitle>

          <CardDescription>
            Review your current booking activity.
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
                interval={0}
                angle={-25}
                textAnchor="end"
                height={55}
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

      <Card>
        <CardHeader>
          <CardTitle>Booking Distribution</CardTitle>

          <CardDescription>
            See how your bookings are distributed by status.
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
          Your booking distribution will appear here when data is available.
        </p>
      </div>
    </div>
  );
}