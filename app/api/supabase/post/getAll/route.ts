import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
            where,
            include,
            take,
            skip,
            orderBy
        } = await request.json();
    
      const posts =  await prisma.post.findMany({
           where,
          include: {
              'comments': true,
              'owner':true,
              lovers: true,
              'viewers':true,
              
            },
            take,
            skip,
            orderBy
      });
        
        return NextResponse.json({data:posts, error:null});
        
    } catch (error) {

        return NextResponse.json({ data: null, error });
    }
}