import React from 'react'
import { getTimeOfDay } from './useGetDayTime';
import { format } from 'date-fns';

type Props = {}

function useContvertData() {

    const getUniqueBooks = (readingProgress) => {
        // Use an object as a lookup table to avoid duplicate bookIds
        const bookMap = {};
      
        return readingProgress.reduce((uniqueBooks, item) => {
          if (!bookMap[item.bookId]) {
            bookMap[item.bookId] = true; // Mark bookId as added
            uniqueBooks.push(item);      // Add the book object to the array
          }else{
            uniqueBooks.find((uniq)=> uniq.bookId === item.bookId).readPages += item.readPages;
          }
          return uniqueBooks;
        }, []);
      };

    const displayFeelingsPieChartData = (condition:boolean, array) => {
     if(!condition){
        return [];
     }
     let feelingsObjs: { feelAfterReading: string, fill: string, feelFrequency: number }[] = [];
      
     array.map((item) => {
       if (!feelingsObjs.find((feelingObj)=>feelingObj.feelAfterReading === item.feelAfterReading)) { 
                     feelingsObjs.push({
                       feelAfterReading: item.feelAfterReading,
                       fill: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
                       feelFrequency: 1,
                       
                     });
                   } else {
                     feelingsObjs.find((item) => item.feelAfterReading === item.feelAfterReading)!.feelFrequency++;
                   }
     })
   
     return feelingsObjs;
                   
      };

      const displayHapinessDayTimeRelationData = (condition:boolean, array) => {
          if(!condition){
            return [];
          }

          let happinessDayTimeArray:any[]=[];
      array.map((item) => {
            const dayTime= getTimeOfDay(new Date(item.startTime));
            if(!happinessDayTimeArray.find((item)=>item.labelForX === `${item.feelAfterReading}-${dayTime}`)) {
              happinessDayTimeArray.push({
                pagesRead: item.pagesRead,
                occurances: 1,
                dayTime: dayTime,
                feelAfterReading: item.feelAfterReading,
                labelForX: `${item.feelAfterReading === 'delighted' ? '😎' : item.feelAfterReading === 'satisfied' ? '😊' : item.feelAfterReading === 'neutral' ? '🫥' : item.feelAfterReading === 'terrified' ? '😭' : ''}-${dayTime}`
              })
            } else {
              happinessDayTimeArray.find((item) => item.labelForX === `${item.feelAfterReading}-${dayTime}`)!.pagesRead += item.pagesRead;
              happinessDayTimeArray.find((item) => item.labelForX === `${item.feelAfterReading}-${dayTime}`)!.occurances += item.occurances;
            }
        });
        return happinessDayTimeArray
      }

      const getHappinessRelationshipConfig = (condition:boolean, array) => {
          if(!condition){   
            return {}
        }
        let happinessRelationshipConfig = {}

        array.map((item) => {
          if(!happinessRelationshipConfig[item.labelForX]) {
            happinessRelationshipConfig[item.labelForX]={
                label: item.labelForX,
                color:'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
            };
          }
        })
        return happinessRelationshipConfig

      }

      const getDailyLineProgressData= (condition:boolean, array) => {
        if(!condition){
            return []
            }
            let dailyLineProgressData:any[] = []
            array.map((progress) => {
                if( dailyLineProgressData.length === 0 || !dailyLineProgressData.find((item:any)=> format(new Date(item.readingDate), 'yyyy-MM-dd') === format(new Date(progress.startTime), 'yyyy-MM-dd'))) {
                    dailyLineProgressData.push({
                        pagesRead: progress.pagesRead,
                        readingDate: format(new Date(progress.startTime), 'yyyy-MM-dd'),
                    });
                }else{
                    dailyLineProgressData.find((item:any)=> format(new Date(item.readingDate), 'yyyy-MM-dd') === format(new Date(progress.startTime), 'yyyy-MM-dd')).pagesRead += progress.pagesRead;
                }
            });

            return dailyLineProgressData
    }
      

      return {
        displayFeelingsPieChartData,
        getUniqueBooks,
        getHappinessRelationshipConfig,
        displayHapinessDayTimeRelationData,
        getDailyLineProgressData,
      }

                
}

export default useContvertData