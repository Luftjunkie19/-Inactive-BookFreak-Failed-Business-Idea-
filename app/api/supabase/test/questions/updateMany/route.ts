import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { data, testId } = await request.json();
    
      const createdQuestions =  await prisma.question.updateMany({
            data,
            where: {
                testId
            }
      });
        
        return NextResponse.json({data:createdQuestions, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}