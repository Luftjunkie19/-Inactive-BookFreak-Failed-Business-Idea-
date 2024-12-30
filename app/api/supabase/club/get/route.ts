import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'



export async function POST(request: NextRequest) {
    try {
    const {
           id, include
        } = await request.json();
    
      const foundClub =  await prisma.club.findUnique({
          where: {
            id
        },include: {
      members:{
              include: {
                user:{include: {
                    ReadingProgress: {
                      include: {
                        book: true
                      },
                    },
                  }},
              },
          },
          requests: {
              include: {
                user: {
                  include: {
                    ReadingProgress: {
                      include: {
                        book: true,
                        user:true,
                    }},
                  }
                },
                },
            }, 
'requirements':true,
          'chat':{
            'include': {
              'messages': {
            include:{
               'recommendation':true,
                sender: true,
                competition: true,
                club: true,
                book:true,
            }
          }, 'Club':true}
        }
      
      
      }
      });
        
        return NextResponse.json({data:foundClub, error:null});
        
    } catch (error) {
        return NextResponse.json({data:null, error});
    }
}