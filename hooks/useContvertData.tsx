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

      const getBarPagesPerHourIndicatorData = (condition:boolean, array) => {
        if(!condition) return [];
      return  array.map((item) => {
          const startTime = new Date(item.startTime);
          const finishTime = new Date(item.finishTime);
          const timeInMinutes = (finishTime.getTime() - startTime.getTime()) / 60000; // 60000 ms in a minute
          const timeInHours = timeInMinutes / 60; // Convert minutes to hours
      
          return {
            pagesRead: item.pagesRead,
            feelAfterReading:item.feelAfterReading,
            title: item.book.title,
            startTime: format(startTime, "MM/dd/yyyy"),
            pagePerMinutes: (item.pagesRead / timeInMinutes).toFixed(2), // Pages per minute
            pagePerHour: (item.pagesRead / timeInHours).toFixed(2), // Pages per hour
          };
        })
      }

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
                color: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
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
              color: item.color
            };
          }
        })
        return happinessRelationshipConfig;

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

    const getMostReadGenres= (condition:boolean, array) => {
    if(!condition){
      return [];
    }
    let mostReadGenres: any[] = [];
    array.map((item) => {
      if(!mostReadGenres.find((genre) => genre.label === item.book.genre)) {
        mostReadGenres.push({
          label: item.book.genre,
          genre: item.book.genre,
          pagesRead: item.pagesRead
          });
          } else {
            mostReadGenres.find((item) => item.genre === item.book.genre).pagesRead += item.pagesRead;
          }
        });
        return mostReadGenres;
    }

    const getMostReadGenresConfig = (condition:boolean, array) => {
      if(!condition){
        return {}
    }
    let mostReadGenresConfig = {}
    array.map((item) => {
      if(!mostReadGenresConfig[item.genre]) {
        mostReadGenresConfig[item.genre] = {
          label: item.genre,
          color: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
        }
        } else {
          mostReadGenresConfig[item.genre].pagesRead += item.pagesRead
          }
          });
  
          return mostReadGenresConfig;
        }

      return {
        getUniqueBooks,
        getHappinessRelationshipConfig,
        displayHapinessDayTimeRelationData,
        getDailyLineProgressData,
        getMostReadGenres,
        getMostReadGenresConfig,
        getBarPagesPerHourIndicatorData
      }

                
}

export default useContvertData