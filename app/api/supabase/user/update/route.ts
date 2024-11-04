import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { data, where } = await req.json();

        const fetchedItem = await prisma.user.update({
            data, 
            where
        });

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (error) {
         return NextResponse.json({error, data:null});
}


}