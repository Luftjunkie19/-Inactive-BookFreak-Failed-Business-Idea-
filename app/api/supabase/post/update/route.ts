import { NextRequest, NextResponse } from 'next/server'
import prisma from 'lib/prisma/prisma'


export async function POST(request: NextRequest) {
    try {
    const {
         data,where
        } = await request.json();
    
        const createdPost = await prisma.post.update({
            data,
          where,
      });
        
      return NextResponse.json({ data:createdPost, error:null});
        
    } catch (error) {
        return NextResponse.json({ data:null, error});
      }
    }