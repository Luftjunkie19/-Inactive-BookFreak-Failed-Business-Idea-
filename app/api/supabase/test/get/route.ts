import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'



export async function POST(request: NextRequest) {
    try {
        const { where } = await request.json();
    
      const foundTest =  await prisma.test.findUnique({
        where,
          include: {
                'Book':true,
                'questions':{
                    include:{
                        'answers':{'include':{
                            'Question':true
                }
            }}
        },
        results:{
            'include':{
                'user': true,
            },
        },
            }
      });
        
        return NextResponse.json({data:foundTest, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}
