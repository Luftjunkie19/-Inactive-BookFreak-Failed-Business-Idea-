import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
      id,
        } = await request.json();
    
      const createdTest =  await prisma.post.findUnique({
          where: {
               id
        },
        include: {
          'owner': true,

          'lovers': {
            'include': {
              'user':true,
            },
          },
          viewers:true,
          'comments': {
            include: {
              'Lover':{'include':{user:true,  'comment':{'include':{'owner':true, 'Lover':true}}}},
              'owner': true,
  
            }
          }
        }
      });
        
        return NextResponse.json(createdTest);
        
    } catch (error) {
      console.error(error);
        return NextResponse.json(error);
    }
}