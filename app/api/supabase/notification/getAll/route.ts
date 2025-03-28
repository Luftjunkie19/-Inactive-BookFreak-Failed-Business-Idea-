import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  where, include } = await req.json();

        const fetchedItem = await prisma.notification.findMany({
           where, include:{'receiver':true, sender:true, 'request':{'include':{'competition':true, club:true}}},
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (err) {
    console.log(err);
        return NextResponse.json({...err, error:'Error occured'});
}


}