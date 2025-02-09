import PrivacySettingsForm from "components/profile-user/dashboard/settings/privacy-settings/PrivacySettingsForm"
import ProfileDashboardBar from "components/Sidebars/left/profile/ProfileDashboardBar"


type Props = {}

function PrivacySettingsPage({ }: Props) {


  return (
    <div className='flex'>
      <ProfileDashboardBar/>
   <PrivacySettingsForm/>
    </div>
  )
}

export default PrivacySettingsPage