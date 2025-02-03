
import ChatBar from 'components/Sidebars/left/ChatBar';

import P2PChatView from 'components/chatView/P2PChatView';


function MessagesHolder({params}:{params:{chatId:string}}) {



  
  


  return (
<div className='h-screen w-full flex'>
  <ChatBar />
      <div className="flex flex-col sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.25rem)] w-full">
       
       <P2PChatView chatId={params.chatId as string} />
  </div>
</div>

  );
}

export default MessagesHolder;
