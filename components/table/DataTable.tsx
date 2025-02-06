"use client"
 
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
      VisibilityState,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnFiltersState
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Button from "components/buttons/Button"
import { useState } from "react"
import LabeledInput from "components/input/LabeledInput"
import { BsThreeDots } from "react-icons/bs"
import { FaColumns, FaSearch } from "react-icons/fa"



 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  filterColumnName:string,
}
 
export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumnName
}: DataTableProps<TData, TValue>) {
 const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>();
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>();

  const table = useReactTable({
    data,
    columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
      state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })
 
    return (
      <div className="w-full flex flex-col gap-6 py-2">
        <div className="flex w-full justify-between items-center">
        <LabeledInput additionalClasses="p-2 max-w-xs w-full" type='dark' placeholder="Filter nicknames..." value={(table.getColumn(filterColumnName)?.getFilterValue() as string) ?? ''} onChange={(e)=>table.getColumn(filterColumnName)?.setFilterValue(e.target.value)}/>
  
        <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button
          type='black'
          additionalClasses="w-fit hover:bg-primary-color transition-all duration-500 hover:scale-95 flex items-center gap-4"
        >

          Columns <FaColumns/> 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-dark-gray border-primary-color border-2 min-w-48 max-w-52 w-full text-white">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
        </div>
        
   
        <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow  key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex flex-col w-full h-full gap-2 items-center justify-center">
                        <FaSearch className="text-primary-color text-6xl"/>
                        <p className="text-white text-center text-base">
                No results have been found
                        </p> 
                   </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
            </div>
            <div className="flex items-center gap-4">
                <Button additionalClasses="cursor-pointer" onClick={()=> table.previousPage()} disableState={!table.getCanPreviousPage()} type='white-blue'>Previous</Button>
                <Button additionalClasses="cursor-pointer" onClick={()=> table.nextPage()} disableState={!table.getCanNextPage()} type='blue'>Next</Button>
            </div>
      </div>
  )
}