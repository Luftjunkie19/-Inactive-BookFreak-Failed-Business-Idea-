import React, { useMemo } from 'react'

function useVisibility() {
    

    const allowedToSeeProperty = (userObj: any,isBlocked: boolean, isFriend: boolean,    property: string,
 ) => {
        if (isBlocked) return false;
        
        if (isFriend && userObj && userObj.onlyFriendsAvailable.find((name)=>name === property)) return true;
        
        if (userObj && userObj.publiclyAvailable.find((name)=>name === property)) return true;
        
        if (userObj && userObj.onlyMeVisible.find((name)=>name === property)) return false;

        return true;
    
}

    
    return {allowedToSeeProperty}



    


}

export default useVisibility