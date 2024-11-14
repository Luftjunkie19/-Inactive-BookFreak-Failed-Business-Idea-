import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { id} = await request.json();
    


        const deletedCompetition = await prisma.competition.delete({
            where: {
                id
            },
        }); 
        console.log(deletedCompetition);

        return NextResponse.json({data:deletedCompetition, error:null});
    } catch (err) {
        console.error(err);
        return NextResponse.json({data:null, error:err});
    }
}