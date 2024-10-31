"use client"
 import { HiArrowsUpDown } from "react-icons/hi2";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { BsThreeDots } from "react-icons/bs"
import { FaBan } from "react-icons/fa6"
import { IoPersonRemoveSharp, IoWarning } from "react-icons/io5"
import { MdEmail } from "react-icons/md"
import Button from "components/buttons/Button";
import { FaCheckCircle } from "react-icons/fa";
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ClubRequester = {
   nickname: string
  photoURL: string
    email: string
    userId: string
    clubId:string
  readBooks: number
    readPages: number
    requiredTextAnswer?:string
    fullfillsRequirements:boolean
  id:string 
  joiningDate:Date

}
 
export const clubRequestColumns: ColumnDef<ClubRequester>[] = [
    {
        'accessorKey': 'id',
         header() {
            return (< ></>)
        },
        cell(props) {
               return (< ></>)
        },
    },
    {
        'accessorKey': 'userId',
         header() {
            return (<div className="hidden opacity-0"></div>)
        },
        cell(props) {
            return (<div className="hidden opacity-0"></div>)
        },
    },
    {
        'enableHiding': true,
        accessorKey: 'photoURL',
        header() {
            return (<div className="hidden opacity-0"></div>)
        },
        cell(props) {
            return (<div className="hidden opacity-0"></div>)
        },
    },
    {
        accessorKey: "nickname",
        header: (props) => {
            return <div onClick={() => {
                props.column.toggleSorting(props.column.getIsSorted() === 'asc')
            }} className="text-base cursor-pointer flex items-center gap-2 text-white">Nickname <HiArrowsUpDown /></div>;
        },
        cell(props) {
            return (<div className="text-white flex items-center gap-2">
                <Image src={props.row.getValue('photoURL') || ''} width={24} height={24} alt="" className="w-8 h-8 rounded-full" />
                <p>{props.row.getValue('nickname')}</p>
            </div>)
        },
    
    },
    {
        accessorKey: "readBooks",
        header(props) {
            return (<div onClick={() => {
                props.column.toggleSorting(props.column.getIsSorted() === 'asc')
            }} className="text-base cursor-pointer flex items-center gap-2 text-white">Read Books
            </div>);
        },
        cell: (props) => {
            return (<div>
                <p className="text-white">{props.row.getValue('readBooks')} Books</p>
            </div>)
        }
    },
    {
        accessorKey: 'readPages',
        header(props) {
            return (<div onClick={() => {
                props.column.toggleSorting(props.column.getIsSorted() === 'asc')
            }} className="text-base cursor-pointer flex items-center gap-2 text-white">Read Pages
            </div>);
        },
        cell: (props) => {
            return (<div>
                <p className="text-white">{props.row.getValue('readPages')} Pages</p>
            </div>)
        }
    },
    {
        accessorKey: "email",
        header: () => (<div className="text-white flex items-center text-base gap-4">
            <p>Email</p>
            <MdEmail className="text-primary-color text-2xl" />
        </div>),
        cell(props) {
            return (<div className="text-white flex items-center gap-2">
                <p>{props.row.getValue('email')}</p>
            </div>)
        },
    },
    {
        accessorKey: 'fullfillsRequirements',
        header: () => (<div className="text-white flex items-center text-base gap-4">
            <p>Requirements fulfilled</p>
        </div>),
        cell(props) { 
            return (<div className="text-white flex items-center gap-2">
                <p>{props.row.getValue('fullfillsRequirements') === true ? 'Yes' : 'No'}</p>
            </div>)
        }
    },
    {
        id: 'requiredTextAnswer',
        header: () => (<div className="text-white flex items-center text-base gap-4">
            <p>Answers</p>
        </div>),
        cell: (props) => {
            return (<div className="text-white flex items-center gap-2">
                {!props.row.getValue('requiredTextAnswer') ? <Button onClick={()=>{console.log('Hello Quack !')}} type="blue">Check Answers</Button> : 'No answer has been required'}
                
            </div>)
        }
  },
  {
    id: 'actions',
    header: () => {
      return (<div className="text-white text-base">Actions</div>)
    },
      cell: ({ row }) => {
        
          const acceptReqeust = async () => {
              console.log(row.getValue('id'), row.getValue('userId'))
              
              try { 
                   const res = await fetch('/api/supabase/club/update', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          id: crypto.randomUUID(), data: {
                members: {
                    'connectOrCreate': {
                        where: {
                            id:row.getValue('clubId'),
                        },
                        create: {
                            id:crypto.randomUUID(),
                            userId:row.getValue('userId'),
                        }
                    }
                }
            }
                      })
                  });

                  const updateRequest = await fetch('/api/supabase/request/update', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          where: { id: row.getValue('id') }, data: {
                              isAccepted: true,
                          }
                      })
                  });
                  
              } catch (err) {
                  
              }
          }
          
          
        return (<div className="flex items-center gap-3">
            <Button onClick={acceptReqeust} type='transparent'>
                <FaCheckCircle className="text-green-400 text-2xl"/>
            </Button>
            <Button type="transparent">
                <FaBan className="text-red-400 text-2xl"/>
            </Button>
      </div>)
    }
  }

]
