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
import { FaLevelDownAlt, FaLevelUpAlt } from "react-icons/fa";
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Admin = {
   nickname: string
  photoURL: string
    role: 'Owner' | 'Admin' | 'Creator',
    id: string,
  email: string,
}
 
export const adminColumns: ColumnDef<Admin>[] = [
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
        accessorKey: 'nickname',
        header: 'Nickname',
        cell: (props) => <div className="flex items-center gap-2 text-white" >
            <Image src={props.row.getValue('photoURL')} width={40} height={40} alt="" className="rounded-full w-8 h-8" />
            <p>{props.row.getValue('nickname')}</p>
        </div>
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: (props) => <div className="flex items-center text-white gap-2">
            {props.row.getValue('role')}
        </div>
 },
  {
    id: 'actions',
    header: () => {
      return (<div className="text-white text-base">Actions</div>)
    },
    cell: ({ row }) => {
      return (<Dropdown placement='bottom-end' classNames={{ 'content': 'bg-dark-gray p-2 border-2 border-primary-color', 'trigger':'text-white w-fit p-2'}}>
      <DropdownTrigger as='div' className="cursor-pointer"  >
      <p className="flex text-white text-sm items-center gap-4">Actions <BsThreeDots className="text-primary-color text-lg"/></p>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem
            data-focus={false}
          key="warn"
            startContent={<FaLevelUpAlt  className={'text-green-300 text-lg'} />}
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
          Upgrade
        </DropdownItem>
        <DropdownItem
            key="trash"
             className="text-white focus:bg-primary-color  hover:bg-primary-color active:bg-primary-color target:bg-primary-color"
          startContent={<FaLevelDownAlt  className={'text-red-400 text-lg'} />}
        >
          Ban Member
        </DropdownItem>
        <DropdownItem
            key="remove"
             className="text-white focus:bg-primary-color  hover:bg-primary-color active:bg-primary-color target:bg-primary-color"
            startContent={<IoPersonRemoveSharp  className={'text-red-500 text-lg'} />}
        >
          Kickout Admin
        </DropdownItem>
        
      </DropdownMenu>
    </Dropdown>)
    }
  }

]
