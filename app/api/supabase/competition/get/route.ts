import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
        const { id, include } = await request.json();
    
        const fetchedTest = await prisma.competition.findUnique({
            where: {
                id,
            },
            include: {
        prize:true,
                members:{
              include: {
                user:{include: {
                    booksInRead: {
                      include: {
                        book: true
                      },
                    },
                  }},
              },
                },
            
'requests': {
              include: {
                user: {
                  include: {
                    booksInRead:true,
                  }
                },
                },
            },    
        chat: {
            include:{messages:true},
          },
        rules:true,
          },   
      });
        
        return NextResponse.json({data:fetchedTest, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}