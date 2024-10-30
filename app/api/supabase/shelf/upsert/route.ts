import prisma from "lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {  data  } = await req.json();

        const fetchedItem = await prisma.shelf.upsert({
            'create': {
                'books': {
                    'connect': data.belovedBooksIds,
                },
                'name': data.name   ,
                'id': data.shelfId,
                'userId': data.userId,
            },
            'update': {
                'books': {
                    'connect': !data.wantsToDelete ? data.belovedBooksIds : undefined,
                    disconnect: data.wantsToDelete ? data.belovedBooksIds : undefined,
                },
            },
            where: {
                id:data.shelfId
            },
        })

        return NextResponse.json({data:fetchedItem, error:null});

  }
    
    catch (error) {
        console.log(error);
        return NextResponse.json({ data: null, error});
}


}