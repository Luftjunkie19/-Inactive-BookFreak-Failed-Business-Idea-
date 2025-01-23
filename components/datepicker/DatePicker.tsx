import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';

import { CalendarIcon } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';

type Props = {selectedDate:Date | undefined, triggerClassName:string, triggerContentClassName:string, setSelectedDate: (date: Date | undefined) => void}

function DatePicker({selectedDate, setSelectedDate, triggerClassName, triggerContentClassName}: Props) {
  return (
    <Popover>
    <PopoverTrigger asChild  className={triggerClassName}>
      <div className={triggerContentClassName}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
      </div>
    </PopoverTrigger>
    <PopoverContent sideOffset={-40} className="w-auto p-0" align="center" >
              <Calendar classNames={{
                'day_selected': 'bg-primary-color text-white',
          
                }}
                
        mode="single"
          selected={selectedDate}
        
                      onSelect={(day, selectedDate) => {
                    
                setSelectedDate(selectedDate);
             

        }}
              
                
      />
    </PopoverContent>
                    </Popover>
  )
}

export default DatePicker