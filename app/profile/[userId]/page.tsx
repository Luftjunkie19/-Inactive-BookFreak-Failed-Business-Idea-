import ProfileDisplayContainer from 'components/profile-user/ProfileDisplayContainer';


function Profile(
  { params }: {
    params:{userId:string}
  }
) {
  const { userId } = params;


  return (
    <div className={`min-h-screen w-full h-full`}>

      <ProfileDisplayContainer userId={userId}/>
      
    </div>
  );
}

export default Profile;
