import ClubChat from "components/club/ClubChat";


export default function Page({ params }: { params: { clubId: string } }) {

    return (
     <ClubChat clubId={params.clubId}/>
    );
}