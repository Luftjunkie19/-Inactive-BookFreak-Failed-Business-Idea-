"use client"

import { Bar, BarChart, CartesianGrid, Label, LabelList, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import React from "react"


interface shadCnProperties<T> {
  data: T[]
  config: ChartConfig,
  dataKeyForXValue: keyof T,
  dataKeyForBarValue: keyof T,
  dataKeyForYValue?: keyof T
  dataKeyFor2XBar?:keyof T
}

export function ShadcnBarChart<T>({data, config,dataKeyFor2XBar, dataKeyForXValue,dataKeyForBarValue, dataKeyForYValue}:shadCnProperties<T>) {

  const chartData = data
  
  const chartConfig = config satisfies ChartConfig

  return (
    <ResponsiveContainer width={"100%"} height={'100%'} className={" h-full w-full"}>

    <ChartContainer config={chartConfig} className="h-full w-full ">
    <BarChart className="w-full h-full" width={270} height={250} accessibilityLayer data={chartData}>
      <CartesianGrid vertical={false} />
      <YAxis dataKey={dataKeyForYValue as string} />
      <XAxis
        dataKey={dataKeyForBarValue as string}
        tickLine={false}
        tickMargin={10}
        axisLine={false}
       
      />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent className="text-white" />} />
      <Bar  dataKey={dataKeyForXValue as string} fill={config[dataKeyForXValue].color} radius={4} />
          {dataKeyFor2XBar && <Bar dataKey={dataKeyFor2XBar as string} fill={config[dataKeyFor2XBar].color} radius={4} />}
    </BarChart>
  </ChartContainer>
    </ResponsiveContainer>
  )
}

interface shadcnPieProperties<T> {
  data: T[]
  config: ChartConfig,
  dataKeyForXValue: keyof T,
  dataKeyForYValue?: keyof T
}



export function ShadcnPieChart<T>({data, config, dataKeyForXValue, dataKeyForYValue}:shadcnPieProperties<T>) {

  const pieChartData = data
  const pieChartConfig = config satisfies ChartConfig


  return (
    <>
    <ResponsiveContainer width={"100%"} height={'100%'} className={" h-full w-full"}>
      <ChartContainer
        config={pieChartConfig}
          className="h-full w-full justify-center items-center flex"
        >
          <PieChart className="w-full h-full"  width={250} height={250}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  hideLabel  />}
            />
          <Pie
              data={pieChartData}
              dataKey={dataKeyForYValue as string}
              nameKey={dataKeyForXValue as string}
              stroke="0"
          >
                <LabelList
                dataKey={dataKeyForXValue as string}
              className="fill-background"
              cx={'50%'}
              cy={'50%'}
                stroke="none"
            fontSize={12}
            formatter={(value) => `${config[value].label}`}
              />
          </Pie>
            <ChartLegend
              content={<ChartLegendContent className="text-white" nameKey={dataKeyForXValue as string} />}
              className="-translate-y-2 text-white flex-wrap items-center flex w-full gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </ResponsiveContainer>
</>
  

  )
}


interface shadcnLineChartProps<T> {
  data: T[]
  config: ChartConfig,
  dataKeyForXLabel: keyof T,
  dataKeyForYValue?: keyof T
}

export function ShadcnLineChart<T>({ config, data, dataKeyForXLabel, dataKeyForYValue }:shadcnLineChartProps<T>) {
  

  return (
    <ChartContainer className="w-full h-full" config={config}>
      <LineChart
        className="w-full h-full"
        width={250} height={250}
            accessibilityLayer
            data={data}
         
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={dataKeyForXLabel as string}
              tickLine={false}
              axisLine={false}
          tickMargin={8}
          
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={dataKeyForYValue as string}
              type="natural"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
  )
}