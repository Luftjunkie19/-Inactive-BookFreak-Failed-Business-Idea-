import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
       data
        } = await request.json();
    

        const createdAnswers = await prisma.answer.createMany({
            data,
      })
        
       return NextResponse.json({data:createdAnswers, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}