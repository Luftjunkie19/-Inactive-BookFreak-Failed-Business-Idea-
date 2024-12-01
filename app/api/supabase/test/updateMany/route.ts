import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
       data,where
        } = await request.json();
    

        const updatedMany = await prisma.test.updateMany({
            data,
            where
      })
        
        return NextResponse.json({data:updatedMany, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}