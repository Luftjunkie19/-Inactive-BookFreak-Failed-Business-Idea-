'use client';

import ProfileDetailsContainer from 'components/profile-user/dashboard/settings/profile-information/ProfileDetailsContainer';
import ProfileDashboardBar from 'components/Sidebars/left/profile/ProfileDashboardBar'
import { useAuthContext } from 'hooks/useAuthContext';





function ProfileInformationPage() {

  const { user } = useAuthContext();

  return (
    <div className='w-full h-full flex'>
      <ProfileDashboardBar />
      {user &&
    <ProfileDetailsContainer user={user}/>
      }
    </div>
  )
}

export default ProfileInformationPage