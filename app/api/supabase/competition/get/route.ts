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
                     ReadingProgress:{
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
                     ReadingProgress:{
                    include: {
                       book: true,
                        user:true,
                    },
                  },
                  }
                },
                },
            },    
        chat: {
            include:{messages:{
              include:{
                
                sender: true,
                competition: true,
                club: true,
                book:true,
              }
            }},
          },
        rules:true,
          },   
      });
        
        return NextResponse.json({data:fetchedTest, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}