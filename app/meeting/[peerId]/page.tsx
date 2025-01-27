import MeetingView from "components/meeting/MeetingView";


export default function MeetingRoom({params}:{params:{peerId:string}}) {

  return (
    <div className="sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden flex ">
      <MeetingView peerId={params.peerId} />
    </div>
  );
}
