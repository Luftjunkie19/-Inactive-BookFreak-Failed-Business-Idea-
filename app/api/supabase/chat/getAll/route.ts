import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
            where,
include,
            take,
            skip,
            orderBy
        } = await request.json();
    
      const createdTest =  await prisma.chat.findMany({
           where:where,
           include,
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json({ data: createdTest, error:null});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ data:null, error});
    }
}