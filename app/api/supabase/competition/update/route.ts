import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const {   data
             } = await request.json();
     

        
        const createdCompetition = await prisma.competition.update({
            where:{
                id:data.competitionId,
            },
            data,
        
        }); 
        console.log(createdCompetition);

        return NextResponse.json({data:createdCompetition, error:null});
    } catch (err) {
        return NextResponse.json({data:null, error:err});
    }
}