import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const { data } = await req.json();
      
      console.log(data);

        const fetchedItem = await prisma.request.create({
           data
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (error) {
      console.log(error);
      return NextResponse.json({ data: null, error });
}


}