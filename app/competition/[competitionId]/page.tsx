import MainContainer from 'components/competition/main/MainContainer';

function Competition({params}:{params:{competitionId:string}}) { 
  const { competitionId } = params;

  return (
    <div
      className={`sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-y-scroll overflow-x-hidden w-full`}
    >
<MainContainer competitionId={competitionId} />
      

      
    
    </div>
  )
}

export default Competition;
