'use client';
import { useQuery } from "@tanstack/react-query";
import ChatList from "components/chatList/chat-lists/ChatList";
import ChatBottomBar from "components/chatList/ChatBottomBar";
import ClubTopBar from "components/TopBar/ClubTopBar";
import { useAuthContext } from "hooks/useAuthContext";
import { Suspense } from "react";

export default function Page({ params }: { params: { clubId: string } }) {
    const { user } = useAuthContext();
    const { clubId } = params;
    const { data: document } = useQuery({
      queryKey:['club', clubId],
      queryFn: () => fetch('/api/supabase/club/get', {
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
        }, 
        body:JSON.stringify({id:clubId, include:{chat:{messages:true, users:true}, members:true}})
      }).then((res)=>res.json())
    });

  

    return (
         <div className="flex flex-col w-full  sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)]">
            {user && document && document.data &&
                <>
                <ClubTopBar clubData={document.data}/>
                
     
          <ChatList document={document.data} messages={document.data.chat.messages}  user={user} isAllowedToSee={document && document.data && document.data.members.find((member)=>member.user.id === user.id) ? true : null} />
               
                 <ChatBottomBar userId={user?.id} chatId={document.data.chat.id} conversationId={clubId} isAllowedToType={document && user && document.data && document.data.members.find((member) => member.user.id === user.id) ? false : true} updateQueryName={"club"}/> 
            </>
            }

        </div>
    );
}