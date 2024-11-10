"use client"

import { Bar, BarChart, CartesianGrid, Label, LabelList, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, XAxis, YAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import React from "react"
import { PieSectorDataItem } from "recharts/types/polar/Pie"


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
          <PieChart className="w-full h-full"  width={400} height={400}>
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
              content={<ChartLegendContent className="text-white text-xs flex-wrap justify-center   " nameKey={dataKeyForXValue as string} />}
              className="-translate-y-2  text-white flex-wrap text-nowrap items-center flex max-w-[80%] gap-2 "
            />
          </PieChart>
        </ChartContainer>
      </ResponsiveContainer>
</>
  

  )
}

interface shadcnRadialChart<T> extends shadcnPieProperties<T>{
activeProperty: keyof T,

}


export function ShadcnRadialChart<T>({data, activeProperty,config, dataKeyForXValue, dataKeyForYValue}:shadcnRadialChart<T>) {
  const id = "pie-interactive"
  const [activePart, setaActivePart] = React.useState(data[0][dataKeyForXValue])
  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item[dataKeyForXValue] === activePart),
    [activePart, data, dataKeyForXValue]
  )

  return (<>
  <ChartStyle id={id} config={config} />
  <ChartContainer
          id={id}
          config={config}
          className="mx-auto aspect-square w-full h-full"
        >
          <PieChart className="w-full h-full" width={250} height={250}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
            className="w-full h-full"
            height={250}
            width={250}
            onClick={(data) => {
              console.log(data);
              setaActivePart(data.name);
            }}

              data={data}
              dataKey={dataKeyForYValue as string}
              nameKey={dataKeyForXValue as string}
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
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
                          className="fill-primary-color  text-3xl font-bold"
                        >
                          {data[activeIndex][dataKeyForYValue as string].toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className=" fill-white text-lg"
                        >
                          {data[activeIndex][dataKeyForXValue as string].slice(0,2)}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend  
              content={<ChartLegendContent className="text-white text-xs p-2" nameKey={dataKeyForXValue as string} />}
              className=" text-white flex p-2  gap-4  items-center w-full"
            />
          </PieChart>
          
        </ChartContainer>
  </>)
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
            <ChartLegend
              content={<ChartLegendContent className="text-white text-nowrap" nameKey={dataKeyForXLabel as string} />}
              className="-translate-y-2 text-white text-nowrap flex-wrap items-center flex w-full gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </LineChart>
          
        </ChartContainer>
  )
}

export function ShadcnAreaChart<T>({ config, data, dataKeyForXLabel, dataKeyForYValue }:shadcnLineChartProps<T>) {}

