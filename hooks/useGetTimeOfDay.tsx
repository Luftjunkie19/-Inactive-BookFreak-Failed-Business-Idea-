import { getHours } from "date-fns";




function useGetTimeOfDay() {
    
    function getTimeOfDay(date:Date) {
        const hour = getHours(date);

        if (hour >= 5 && hour < 12) {
            return 'morning';
        } else if (hour >= 12 && hour < 18) {
            return 'afternoon';
        } else if (hour >= 18 && hour < 21) {
            return 'evening';
        } else {
            return 'night';
    
        
        }
    }
    
    return {
        getTimeOfDay
    }
}

export default useGetTimeOfDay