"use client"

import { Bar, BarChart, CartesianGrid, Label, LabelList, Pie, PieChart, ResponsiveContainer, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import React from "react"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 250 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function ShadcnBarChart() {
  return (
    <ResponsiveContainer width={"100%"} height={'100%'} className={" h-full  w-full"}>

    <ChartContainer config={chartConfig} className="h-full w-full ">
    <BarChart className="w-full h-full" width={270} height={250} accessibilityLayer data={chartData}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent className="text-white" />} />
      <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
    </BarChart>
  </ChartContainer>
    </ResponsiveContainer>
  )
}




const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)", label:'hello' },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" , label:'cześć' },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" , label:'yo' },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" , label:'shalom' },
  { browser: "other", visitors: 190, fill: "var(--color-other)" , label:'merhaba' },
]
const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig
export function ShadcnPieChart() {
  const totalVisitors = React.useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])
  return (
    <ResponsiveContainer width={"100%"} height={'100%'} className={" h-full  w-full"}>
      <ChartContainer
        config={pieChartConfig}
          className="h-full w-full justify-center items-center flex"
        >
          <PieChart className="w-full h-full"  width={250} height={250}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          <Pie
              data={pieChartData}
              dataKey="visitors"
              nameKey="browser"
              stroke="0"
          >
                <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={10}
                formatter={(value: keyof typeof pieChartData) =>
                pieChartConfig[value].label
                }
              />
          </Pie>
             <ChartLegend
              content={<ChartLegendContent className="text-white" nameKey="browser" />}
              className="-translate-y-2 text-white flex-wrap items-center flex w-full gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </ResponsiveContainer>

  )
}
