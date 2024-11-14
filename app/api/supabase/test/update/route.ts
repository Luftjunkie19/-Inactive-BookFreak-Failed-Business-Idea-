import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
      data,where
        } = await request.json();
    

        const createdTest = await prisma.test.update({
          where,
          data,
      });

      // console.log(createdTest);
        
        return NextResponse.json({data:createdTest, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}