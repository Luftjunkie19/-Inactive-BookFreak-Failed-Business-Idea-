'use server';
import prisma from 'lib/prisma/prisma'


 export  async function suspendUser (state:'suspend' | 'block', blockerId:string, userId:string) {
     try {
         const result = await prisma.blockedUser.upsert({
             create: {
                 'blockedBy': blockerId,
                 'blockedId': userId,
                 'blockMessaging': state === 'block' ? true : false,
                 'wantSeeContent': state === 'block' ? false : true,
                 'isTemporarilyBlocked': state === 'block' ? false : true,
                 id: `${blockerId}#${userId}`,
                 'dateOfBlock': state === 'suspend' ? new Date() : undefined,
                 'endOfBlock': state === 'suspend' ? new Date(new Date().getTime() + (86400000 * 7)) : undefined
             },
             where: {
                 id: `${blockerId}#${userId}`
             },
             update: {
                 'blockedBy': blockerId,
                 'blockedId': userId,
                 'blockMessaging': true,
                 'wantSeeContent': true,
                 'isTemporarilyBlocked': true,
                 id: `${blockerId}#${userId}`
             }
         });
    
         return result;
     }
     catch (err) {
         return { data: null, error:err}
}

}