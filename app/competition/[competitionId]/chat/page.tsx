
import CompetitionChat from "components/competition/CompetitionChat";


export default function Page({params}:{params:{competitionId:string}})   {
    const {competitionId}=params;

    return (
        <div className="flex flex-col w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)]">
        <CompetitionChat competitionId={competitionId} />
        </div>
    );
    
}