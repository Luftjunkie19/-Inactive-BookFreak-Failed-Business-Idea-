import CompetitionAd from 'components/advertisements/CompetitionAd'
import { formatDistanceToNow } from 'date-fns'
import { Lock } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { BiShieldQuarter } from 'react-icons/bi'
import { BsListTask } from 'react-icons/bs'
import { FaTasks, FaUserFriends } from 'react-icons/fa'
import { FaClockRotateLeft, FaLockOpen } from 'react-icons/fa6'
import { GiCrane } from 'react-icons/gi'
import { IoChatbubbles } from 'react-icons/io5'
import { TbListDetails } from 'react-icons/tb'

type Props = {document:{data:any | null, error:any | null}}

function ClubDetails({document}: Props) {
  return (
      <>
      {document && document.data &&   
        <div className="flex sm:flex-col 2xl:flex-row 2xl:items-center gap-6 px-1 w-full">
        <div className="flex sm:flex-col xl:flex-row 2xl:flex-col my-4 mx-2 gap-3 lg:max-w-full 2xl:max-w-sm sm:max-w-sm w-full">
          <div className="w-full h-72 max-w-sm activity-section  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.chat.messages.filter((item)=> new Date().getTime() - new Date(item.sentAt).getTime() < 86400000).length} New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month {document.data.chat.messages.filter((item)=> new Date().getTime() - new Date(item.sentAt).getTime() < (86400000 * 30)).length} New Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.members.length} Members Together</p>
                <p className='text-sm font-extralight'>Yesterday {document.data.members.filter((item)=> new Date().getTime() - new Date(item.joinedAt).getTime() < 86400000).length} New Members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated {formatDistanceToNow(new Date(document.data.creationDate))}</p>
                <p className='text-xs font-extralight'>Est. {new Date(document.data.creationDate).toDateString()}</p>
              </div>
            </div>
          </div>
              <div className="w-full h-72 max-w-sm details  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><TbListDetails /> Details</p>
            <div className="flex items-center gap-4">
              {document.data.members.find((item)=>item.isCreator) && <Image alt='' width={60} height={60} className='w-10 h-10 rounded-full' src={document.data.members.find((item)=>item.isCreator).user.photoURL}/>}
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated By</p>
                <p className='text-sm font-extralight'>{document.data.members.find((item)=>item.isCreator).user.nickname}</p>
              </div>
            </div>
              <div className="flex items-center gap-4">
                {document.data.isFreeToJoin ? <FaLockOpen className="text-primary-color text-2xl" /> :        <Lock className="text-primary-color text-2xl" />}
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.isFreeToJoin ? `Open Club` : `Closed Club`}</p>
                <p className='text-sm font-extralight'>{document.data.isFreeToJoin ? `Click the button and enjoy !` : `Request to join the club`}</p>
              </div>
            </div>
             <div className="flex items-center gap-3">
              <BiShieldQuarter className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Administration</p>
                <div className="flex items-center">
                  {document.data.members.filter((item)=>item.isAdmin).map((memberItem)=>(<Image key={memberItem.id} alt='' width={60} height={60} className='w-8 h-8 rounded-full' src={memberItem.user.photoURL}/>))}
          </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex px-3 py-1 flex-col gap-3 max-w-4xl w-full">
          <div className="w-full h-72 bg-dark-gray p-2 club-requirements rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaTasks className='text-2xl' /> Club Requirements</p>
            <ul className='py-2'>
              {document.data.requirements.length > 0 ? document.data.requirements.map((item, index) => (<li key={index} className='text-white flex gap-1 items-center'>
              
            -  
                {item.requirementQuestion && item.requirementQuestionPossibleAnswers.length > 0 && 
                <p>{item.requirementQuestion}: {item.requirementQuestionPossibleAnswers.join(', ')}</p>
                }

                {item.requiredBookType && item.requiredPagesRead && 
                <p>{item.requiredBookType}: {item.requiredPagesRead} Pages</p>
                }

                {item.requiredBookType && item.requiredBookRead && <p>{item.requiredBookType}: {item.requiredBookRead} Books</p>}
                
             
              
              </li>)) : <>
                <p>No requirements have been estabilished.</p>
                </>}
            </ul>
            <p className='flex gap-4 items-center text-lg font-bold text-white'><BsListTask className='text-2xl' /> Description</p>
            <div className="max-h-44 overflow-y-auto h-full text-white">{document.data.description}</div>
          </div>

       <CompetitionAd />

        </div>
</div>
        }
      
      </>
  )
}

export default ClubDetails