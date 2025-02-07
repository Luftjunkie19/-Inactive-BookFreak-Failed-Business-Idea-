import MainDashboardViewContainer from "components/profile-user/dashboard/main/MainDashboardViewContainer"

function Page() {

  return (
    <div className='flex sm:h-[calc(100vh-3rem)] overflow-y-auto lg:h-[calc(100vh-3.5rem)] flex-col gap-3 py-2'>
      <MainDashboardViewContainer/>
    </div>
  )
}

export default Page