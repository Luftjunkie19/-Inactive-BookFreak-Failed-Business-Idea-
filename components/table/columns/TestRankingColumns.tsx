"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Result = {
  id: string
  photoURL: string
  userId:string
  nickname: string
  gainedPoints: number
  accuracyOnQuestionsQuote: number
  timeSpent:number
  timeStarted: Date,
  timeFinished: Date
}
 
export const testResultsColumns: ColumnDef<Result>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
     cell(props) {
       return <p className="text-white">{props.row.getValue('id')}</p>
    },
  },
  {
    accessorKey: 'userId',
    header: () => {
      return <></>
    },
    cell(props) {
      return <></>
    },
  
  },
  {
    accessorKey: "nickname",
    header: "Nickname",
    cell(props) {
      return( <div className="flex items-center gap-2">
<Image src={props.row.getValue('photoURL')} alt="Profile Image" width={50} height={50} className="w-8 h-8 rounded-full"/>

        <p className="text-white text-nowrap">{props.row.getValue('nickname')}</p>
      </div>)
    },
  },
  {
    accessorKey: "photoURL",
    header(props) {
      return <></>
    },
    cell(props) {
      return <></>
    },
  },
  {
    accessorKey: "accuracyOnQuestionsQuote",
    header: "Accuracy Questions",
    cell: (props) => {
      return <div className="text-center text-white">{props.row.getValue('accuracyOnQuestionsQuote')}%</div>
    }
  },
  {
    'accessorKey': 'gainedPoints',
    'header': 'Points',
    cell(props) {
      return <div className="text-center text-white text-nowrap">{props.row.getValue('gainedPoints')} Points</div>
    },

  },
  {
    accessorKey: 'timeSpent',
    header: 'Time Spent',
    cell(props) {

         const totalSeconds = Math.floor((props.row.getValue('timeSpent') as number) / 1000);  // Convert milliseconds to seconds
    const minutes = Math.floor(totalSeconds / 60);  // Get minutes
    const remainingSeconds = totalSeconds % 60;  // 

      return <div className="text-white text-nowrap">{minutes}:{remainingSeconds}</div>
    }
},
  {
    accessorKey: 'timeStarted',
       header(props) {
      return <></>
    },
    cell(props) {
      return <></>
    },
  },
  {
    accessorKey: 'timeFinished',
       header(props) {
      return <></>
    },
    cell(props) {
      return <></>
    },
  },

  

]
