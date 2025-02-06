
import ClubMainContainer from 'components/club/main/ClubMainContainer';

function Club({params}:{params:{clubId:string}}) {
  const { clubId: id } = params;



  return (
    <div
      className={`w-full main-page sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden`}
    >
      
      <ClubMainContainer id={id}/>
        


      

    </div>
  );
}

export default Club;
