
import { CameraDeviceInfo, MicrophoneDeviceInfo } from '@videosdk.live/react-sdk';
import { PlaybackDeviceInfo } from '@videosdk.live/react-sdk/dist/types/deviceInfo';
import Button from 'components/buttons/Button';
import React, { useState } from 'react'
import { IconType } from 'react-icons'
import { FaMicrophone, FaPlay } from 'react-icons/fa6';





type Props<T> = {
    Icon: IconType,
    activeDevice: boolean,
  devices: T[],
  onDeviceChange: (device: T) => void,
  bottomManager?:React.ReactNode
   
}

function PreSetupDropDown<T>({Icon, activeDevice, devices, bottomManager, onDeviceChange}: Props<T>) {
  const [open, setOpen] = useState<boolean>(false)
  
  

  return (
      <div className="max-w-72 min-w-60 relative top-0 left-0 w-full">
                   <div onClick={() => setOpen(!open)} className="bg-dark-gray cursor-pointer border-2 border-primary-color rounded-md  p-2 flex justify-between items-center w-full">
                     <Icon className='text-white text-2xl' />
                     <div className="flex items-center gap-2">
                       <p></p>
                     </div>
                   </div>
          <div className={`absolute z-10 ${open ? 'opacity-100 scale-100 min-h-60 max-h-64 h-full' : 'opacity-0 scale-50 h-0'} duration-200 transition-all flex flex-col justify-between gap-2 top-10 left-0 max-w-xs rounded-md w-full  bg-dark-gray border-primary-color border-2`}>
               <div className="flex flex-col overflow-y-auto p-2 w-full gap-2">
                  {devices.map((device) => (  <div onClick={() => onDeviceChange(device)} key={device.deviceId} className={`p-2 cursor-pointer ${activeDevice ? 'bg-primary-color' : ''} hover:bg-primary-color/75 transition-all flex items-center gap-2 rounded-md cursor`}>
                  <Icon className='text-white text-2xl' />
                  <p className="text-white text-xs line-clamp-1">{device.label}</p>
                </div>))}
        </div>
    {bottomManager}
                   </div>
                 </div>
  )
}

export default PreSetupDropDown