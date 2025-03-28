import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  id, userId, clubId, competitionId, data  } = await req.json();

        const fetchedItem = await prisma.member.update({
           where:{
            id,
            userId,
            clubId,
            competitionId
        }, 
        data
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (err) {
    console.log(err);
        return NextResponse.json({data:null, error:err});
}


}