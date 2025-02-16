"use server";

import prisma from "../prisma/prisma";



export async function removeFriend(userId: string, friendId: string) {

    try {
        const removedFriends=await prisma.friend.deleteMany({
            where: {
                OR: [
                    {
                        'inviteeId': userId,
                        'inviterUserId': friendId
                    },
                    {
                        'inviteeId': friendId,
                        'inviterUserId': userId
                    }
                ]
            }
        });

        return removedFriends;

    } catch (err) {
        console.log(err);
        return err;
    }

}



