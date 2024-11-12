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
import toast from "react-hot-toast";
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Competitior = {
   nickname: string
   userId:string
  photoURL: string
  email: string
  readBooks: number,
  readPages:number,
  id:string,
  associationId:string
  joiningDate:Date

}
 
export const columns: ColumnDef<Competitior>[] = [
  {
    accessorKey: "id",
    header() {
      return(<div className="hidden opacity-0"></div>)
    },
  cell(props) {
    return(<div className="hidden opacity-0"></div>)
  },
  },
  {
    accessorKey: "userId",
    header() {
      return(<div className="hidden opacity-0"></div>)
    },
  cell(props) {
    return(<div className="hidden opacity-0"></div>)
  },
  },
  {
    'enableHiding': true,
    accessorKey: 'photoURL',
    header() {
      return(<div className="hidden opacity-0"></div>)
    },
  cell(props) {
    return(<div className="hidden opacity-0"></div>)
  },
  },
  {
    accessorKey: "associationId",
    header() {
      return(<div className="hidden opacity-0"></div>)
    },
  cell(props) {
    return(<div className="hidden opacity-0"></div>)
  },
  },
  {
    accessorKey: "nickname",
    header: (props) => {
      return <div onClick={() => {
        props.column.toggleSorting(props.column.getIsSorted() === 'asc')
      }} className="text-base cursor-pointer flex items-center gap-2 text-white">Nickname <HiArrowsUpDown />
      </div>;
    },
    cell(props) {
      return (<div  className="text-white flex items-center gap-2">
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
    cell: (props)=>{
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
    cell: (props)=>{
      return (<div>
       <p className="text-white">{props.row.getValue('readPages')} Pages</p>
     </div>)
   }
  },
  {
    accessorKey: "email",
    header: ()=>(<div className="text-white flex items-center text-base gap-4">
      <p>Email</p>
      <MdEmail className="text-primary-color text-2xl"/>
    </div>),
      cell(props) {
      return (<div className="text-white flex items-center gap-2">
        <p>{props.row.getValue('email')}</p>
      </div>)
    },
  },
  {
    accessorKey: 'joiningDate',
    header: (props) => {
      return <div className="text-base text-white">Joined</div>;
    },
    cell(props) {
      return (<div className="text-white flex items-center gap-2">
        <p>{formatDistanceToNow(props.row.getValue('joiningDate'))}</p>
      </div>)
    },
  },
  {
    id: 'actions',
    header: () => {
      return (<div className="text-white text-base">Actions</div>)
    },
    cell: ({ row }) => {

      const warnUser = async ()=>{
        // await fetch('/api/supabase/notification/create', {

        // })
      };

      const banUser = async ()=>{
        try{
        const res=  await fetch('/api/supabase/member/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: row.getValue('id'), userId:row.getValue('userId'), competitionId:row.getValue('associationId') ?? undefined, clubId:row.getValue('associationId') ?? undefined, data: {
                isBannedFromUsage: true,
                banExpiryDate: new Date(new Date().setDate(new Date().getDate() + 7))
              }
            })
          });

          const {data, error} = await res.json();

          if(error){
            console.log(error);
            toast.error('Something went wrong.');
            throw new Error(error);

          }
  
          if(data) toast.success(`User has been banned.`);

        }catch(error){
          console.log(error);
        }
   
      };

      const kickoutUser = async ()=>{
        try{
       const res=   await fetch('/api/supabase/member/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              },
            body: JSON.stringify({
              where:{id: row.getValue('id'), competitionId:row.getValue('competitionId')}
            })
          });

          const {data, error} = await res.json();

          if(error){
            toast.error(`Something went wrong.`);
            return;
          }

          if(data){
            toast.success(`User has been kicked out.`);
          }
          

        }catch(err){
          console.log(err);
        }
      }


      return (<Dropdown placement='bottom-end' classNames={{ 'content': 'bg-dark-gray p-2 border-2 border-primary-color', 'trigger':'text-white w-fit p-2'}}>
      <DropdownTrigger as='div' className="cursor-pointer"  >
      <p className="flex text-white text-sm items-center gap-4">Actions <BsThreeDots className="text-primary-color text-lg"/></p>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem
            data-focus={false}
          key="warn"
            startContent={<IoWarning className={'text-yellow-700 text-lg'} />}
            classNames={{
              'base': '', 
              'description': '',
              'selectedIcon': '',
              'shortcut': '',
              'title': '',
              'wrapper':''
            }}
            className="text-white focus:bg-primary-color  hover:bg-primary-color active:bg-primary-color target:bg-primary-color"
        >
          Warn Member
        </DropdownItem>
        <DropdownItem
        onClick={banUser}
            key="trash"
             className="text-white focus:bg-primary-color  hover:bg-primary-color active:bg-primary-color target:bg-primary-color"
          startContent={<FaBan  className={'text-red-400 text-lg'} />}
        >
          Ban Member
        </DropdownItem>
        <DropdownItem
        onClick={kickoutUser}
            key="remove"
             className="text-white focus:bg-primary-color  hover:bg-primary-color active:bg-primary-color target:bg-primary-color"
            startContent={<IoPersonRemoveSharp  className={'text-red-500 text-lg'} />}
        >
          Kickout member
        </DropdownItem>
        
      </DropdownMenu>
    </Dropdown>)
    }
  }

]
