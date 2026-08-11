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

type BookingStatusData =
  AdminDashboardData["bookingStatus"];

type AdminBookingStatusChartProps = {
  bookingStatus: BookingStatusData;
};

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function AdminBookingStatusChart({
  bookingStatus,
}: AdminBookingStatusChartProps) {
  const chartData = [
    {
      status: "Requested",
      bookings: bookingStatus.requested,
      fill: "var(--chart-1)",
    },
    {
      status: "Accepted",
      bookings: bookingStatus.accepted,
      fill: "var(--chart-2)",
    },
    {
      status: "Declined",
      bookings: bookingStatus.declined,
      fill: "var(--chart-3)",
    },
    {
      status: "Canceled",
      bookings: bookingStatus.canceled,
      fill: "var(--chart-3)",
    },
    {
      status: "Paid",
      bookings: bookingStatus.paid,
      fill: "var(--chart-2)",
    },
    {
      status: "In Progress",
      bookings: bookingStatus.inProgress,
      fill: "var(--chart-4)",
    },
    {
      status: "Completed",
      bookings: bookingStatus.completed,
      fill: "var(--chart-5)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Status</CardTitle>

        <CardDescription>
          Compare bookings by their current status.
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
            margin={{
              top: 10,
              right: 12,
              left: 0,
              bottom: 8,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={60}
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
              {chartData.map((entry) => (
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
  );
}