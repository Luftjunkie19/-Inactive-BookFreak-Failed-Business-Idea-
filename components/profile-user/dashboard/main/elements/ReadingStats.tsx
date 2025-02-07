'use client';
import { ChartConfig } from '@/components/ui/chart';
import { ShadcnBarChart, ShadcnLineChart, ShadcnPieChart } from 'components/charts/ShadcnChart';
import { format, intervalToDuration } from 'date-fns';
import useContvertData from 'hooks/useContvertData';
import React from 'react'

type Props = {
    document: {
        data: any | null, error: any | null
    },
    
}

function ReadingStats({
    document
}: Props) {

    const {displayFeelingsPieChartData, getUniqueBooks, displayHapinessDayTimeRelationData, getHappinessRelationshipConfig, getDailyLineProgressData}=useContvertData();
    
      const pieChartHappinessDayTimeRelationshipData = document && displayHapinessDayTimeRelationData(document && document.data, document.data.ReadingProgress);


  return (
         <div id="reading-stats"  className="flex max-w-6xl w-full flex-col gap-3">
                          <p className='text-white text-3xl font-semibold'>Your Book Reading Statistics</p>
                         <div className="flex gap-3 max-w-6xl overflow-x-auto items-center">
                             <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
                       <ShadcnBarChart data={document.data.ReadingProgress.map((item) => {
                    const startTime = new Date(item.startTime);
                    const finishTime = new Date(item.finishTime);
                    const timeInMinutes = (finishTime.getTime() - startTime.getTime()) / 60000; // 60000 ms in a minute
                    const timeInHours = timeInMinutes / 60; // Convert minutes to hours
                
                         return {
                           pagesRead: item.pagesRead,
                           feelAfterReading: item.feelAfterReading,
                           startTime: format(startTime, "dd.MM.yyyy"),
                           timeSpent: `${format(startTime, "dd.MM.yyyy")}, ${intervalToDuration({'start':startTime, end:finishTime}).hours}:${intervalToDuration({'start':startTime, end:finishTime}).minutes}:${intervalToDuration({'start':startTime, end:finishTime}).seconds}`,
                      pagePerMinutes: (item.pagesRead / timeInMinutes).toFixed(2), // Pages per minute
                           pagePerHour: (item.pagesRead / timeInHours).toFixed(2), // Pages per hour
                      
                    };
                  }) ?? [
                  {pagesRead:20,
                    pagePerHour:30,
                  }
                              ]} config={{
                              pagesRead:{
                                label:'Read Pages',
                                color: '#2563eb',
                                },
                                timeSpent: {
                                  label: 'Time Spent',
                                  color: '#2563eb',
                                },
                                startTime: {
                                  label: 'Start Time',
                                  color: '#2563eb',
                                },
                              pagePerMinutes:{
                                label: 'Pages Per Minute',
                                color: '#2563eb',
                              },
                              pagePerHour:{
                                label: 'Pages Per Hour',
                                color: '#2563eb',
                              }
                              }} dataKeyForXValue={'pagePerHour'} dataKeyForBarValue={'startTime'} dataKeyFor2XBar={'pagesRead'} />
                            </div>
                         
                            <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
                            <ShadcnPieChart data={pieChartHappinessDayTimeRelationshipData} config={getHappinessRelationshipConfig(document && document.data, pieChartHappinessDayTimeRelationshipData)} dataKeyForXValue={'labelForX'} dataKeyForYValue={'occurances'}  />
                            </div>
                         
                          <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
                         
                              <ShadcnLineChart dataKeyForXLabel={'readingDate'} dataKeyForYValue={'pagesRead'}  data={getDailyLineProgressData(document && document.data, document.data.ReadingProgress)} config={{
                                pagesRead:{
                                label:'Read Pages',
                                color: '#2563eb',
                                },
                              readingDate:{
                                label: 'Reading Date',
                                color: '#2563eb',
                              }
                } satisfies ChartConfig} />
                          </div>
                
                         </div>
                        
                     
                          
                         </div>
  )
}

export default ReadingStats