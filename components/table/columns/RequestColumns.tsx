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
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Requester = {
   nickname: string
  photoURL: string
    email: string
  userId:string
    readBooks: number
  competitionId:string
    readPages: number
    requiredTextAnswer?:string
    fullfillsRequirements:boolean
  id:string 
  joiningDate:Date

}
 
export const requestColumns: ColumnDef<Requester>[] = [
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
        'accessorKey': 'competitionId',
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
          const queryClient = useQueryClient(); // Call hook at the to
          
          
          const acceptReqeust = async () => {
              console.log(row.getValue('id'), row.getValue('userId'))
              
              try {
                  
                  const res = await fetch('/api/supabase/competition/update', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          id: row.getValue('competitionId'),
                          data: {
                members: {
                        create: {
                            id:crypto.randomUUID(),
                            userId:row.getValue('userId'),
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

                  
                  console.log(await updateRequest.json());
                  

                  const fetchedRes = await res.json();

                  const { data, error } = fetchedRes;

                  console.log(data, error);


                  await queryClient.invalidateQueries({ queryKey: ['competition', row.getValue('competitionId')], type: 'all' });

                  if (error) {
                      toast.error(`Somethhing went not correctly !`);
                      throw new Error('Somethhing went not correctly !')
                  }
                  
                  console.log(data);
                  toast.success('Successfully accepted');


                  
              } catch (err) {
                  console.log(err);
              }
          }

          const rejectRequest = async () => {
              try {
                
                  const updateRequest = await fetch('/api/supabase/request/delete', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({
                       where: { id: row.getValue('id') }
                   })
               });

               
           console.log(await updateRequest.json());
           
             await queryClient.invalidateQueries({ queryKey: ['competition', row.getValue('competitionId')], type: 'all' });
            }catch(err){
                  console.log(err);
            }

          }
          
          
        return (<div className="flex items-center gap-3">
            <Button onClick={acceptReqeust} type='transparent'>
                <FaCheckCircle className="text-green-400 text-2xl"/>
            </Button>
            <Button onClick={rejectRequest} type="transparent">
                <FaBan className="text-red-400 text-2xl"/>
            </Button>
      </div>)
    }
  }

]
