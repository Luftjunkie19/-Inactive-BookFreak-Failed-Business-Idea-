import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
        where,
        include
        } = await request.json();
    
      const foundChat =  await prisma.chat.findUnique({
          where: where,
           include:include || undefined
      });
        
        return NextResponse.json({data:foundChat, error:null});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({data:null, error});
    }
}