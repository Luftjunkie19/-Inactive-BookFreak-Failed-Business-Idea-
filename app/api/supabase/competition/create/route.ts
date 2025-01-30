import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json();


        const chat =await prisma.chat.create({ data: { id: data.chatId, 'dateOfCreation': new Date() } });

                  
        const createdCompetition = await prisma.competition.create({
            data:{...data, chatId: chat.id},
        }); 

        return NextResponse.json({data:createdCompetition, error:null});
    } catch (err) {
        return NextResponse.json({data:null, error:err});
    }
}