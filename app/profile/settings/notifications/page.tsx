import NotificationSettingsPanel from "components/profile-user/dashboard/settings/notifications/NotificationSettingsPanel"
import ProfileDashboardBar from "components/Sidebars/left/profile/ProfileDashboardBar"

type Props = {}

function NotificationsPage({}: Props) {
  return (
    <div className='w-full flex'>
       <ProfileDashboardBar/>
     <NotificationSettingsPanel/>
    </div>
  )
}

export default NotificationsPage