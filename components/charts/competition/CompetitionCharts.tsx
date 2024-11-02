import React from 'react'
import { ResponsiveContainer, BarChart, CartesianGrid,Bar,Tooltip, Legend, XAxis, YAxis } from 'recharts'

interface Props<data> { className?: string, dataKeyForXValue: keyof data, dataKeyForYValue:keyof data |  string, dataKeyForYValue2?:keyof data |  string, arrayOfData:data[], keysOfData?:keyof data[]}

export function PagesPerDayChart<data>({className, dataKeyForXValue,dataKeyForYValue, arrayOfData,dataKeyForYValue2, keysOfData}: Props< data>) {
  const generateColor = () => {
    const newColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    return newColor;
  };
  
  return (
      <ResponsiveContainer className={className} width="100%" height="100%">
          <BarChart className='w-full h-full' width={250} height={250}  data={arrayOfData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey={(dataKeyForXValue as string)} />
  <YAxis />
  <Tooltip />
        <Legend />
        <Bar radius={[3, 3, 0, 0]} dataKey={(dataKeyForYValue as string)} fill={generateColor()} />
             {/* <Bar radius={[3, 3, 0, 0]} dataKey={(dataKeyForYValue2 as string)} fill={generateColor()} /> */}
       
</BarChart>
    </ResponsiveContainer>
  )
}

