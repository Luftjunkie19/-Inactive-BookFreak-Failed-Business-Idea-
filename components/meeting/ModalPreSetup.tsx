import { CameraDeviceInfo, createCameraVideoTrack, createMicrophoneAudioTrack, MicrophoneDeviceInfo } from '@videosdk.live/react-sdk'
import { PlaybackDeviceInfo } from '@videosdk.live/react-sdk/dist/types/deviceInfo'
import { DevicesMap } from 'components/TopBar/UserChatTopBar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IconBaseProps, IconType } from 'react-icons'
import { FaCamera, FaCameraRetro, FaMicrophone } from 'react-icons/fa6'
import PreSetupDropDown from './PreSetupDropDown'
import { CgMusicSpeaker } from 'react-icons/cg'
import { BsSpeakerFill } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Button from 'components/buttons/Button'




type Props = {
  devices: DevicesMap,
  isSetupOpen: boolean,
  onClose: () => void,
  handleCall: ()=> Promise<void>,

}

function ModalPreSetup({ devices, isSetupOpen, onClose, handleCall}: Props) {

  const [selectedWebCamId, setSelectedWebCamId] = useState<string>();
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>();
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>();

  const videoReference = useRef<HTMLVideoElement>(null);
  const audioReference = useRef<HTMLAudioElement>(null);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<MediaStream>();
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<MediaStream>();

  const selectCameraSource= (webCamID:string)=>{
    //For Getting Video Tracks
    setSelectedWebCamId(webCamID);
  }
  const selectAudioDevice =  (selectedMicId: string) => {

        setSelectedMicrophoneId(selectedMicId);

  }


  const getSelectedMicrophone = useCallback(async () => {
    try {
      //Returns a MediaStream object, containing the Audio Stream from the selected Mic Device.
      const customAudioStream = await createMicrophoneAudioTrack({
        // Here, selectedMicId should be the microphone id of the device selected by the user.
        microphoneId: selectedMicrophoneId,
      });
      //To retrive audio tracks that will be displayed to the user from the stream.
      const audioTracks = customAudioStream.getAudioTracks();
      const audioTrack = audioTracks.length ? audioTracks[0] : null;
      if (audioTrack && audioReference.current) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(audioTrack);

        setSelectedAudioDevice(mediaStream);
        audioReference.current.srcObject = mediaStream;
        audioReference.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error));
    
      }
    } catch (error) {
      console.log("Error in getting Audio Track", error);
  

    }
  }, [selectedMicrophoneId]);

  const getSelectedWebCam = useCallback(async () => {
    try {
      //Returns a MediaStream object, containing the Video Stream from the selected Webcam Device.
      const customVideoStream = await createCameraVideoTrack({
        // Here, selectedWebcamId should be the webcam id of the device selected by the user.
        cameraId: selectedWebCamId,
        encoderConfig: "h540p_w960p",
        optimizationMode: "motion",
        multiStream: false,
      });
      //To retrive video tracks that will be displayed to the user from the stream.
      const videoTracks = customVideoStream?.getVideoTracks();
      const videoTrack = videoTracks.length ? videoTracks[0] : null;
    
      if (videoTrack && videoReference.current) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(videoTrack);

        setSelectedVideoDevice(mediaStream);
        videoReference.current.srcObject = mediaStream;
      
        videoReference.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      }

    } catch (error) {
      console.log("Error in getting Video Track", error);
    }
  }, [selectedWebCamId]);


  const toggleMicrophone = async () => {
    if (audioReference.current ) {
      if (audioReference.current.srcObject) {
        audioReference.current.srcObject = null;   
      }
      else{
      await getSelectedMicrophone();
    }
    }
  }


  const toggleWebCam = async () => {
    if (videoReference.current) {
      if (videoReference.current.srcObject) {
        videoReference.current.srcObject = null;
      }
else{
      await getSelectedWebCam();
    }
    }
  }

  useEffect(() => {
    getSelectedWebCam();
    getSelectedMicrophone();
  }, []);


  






  
  return (
    <div className={`absolute top-0 left-0 w-full h-full transition-all ${isSetupOpen ? `z-[9999999999999999999999999999999] opacity-100 scale-100` : ' -z-10 opacity-0 scale-50'}  bg-secondary-color/95 flex flex-col gap-2`}>
      <button onClick={onClose} className='p-2 self-end text-white flex items-center gap-2'>
        <IoClose className='text-3xl text-red-400' />
        <p>Close</p>
      </button>
      

       
      <div className="flex flex-col max-w-6xl h-full w-full mx-auto justify-center items-center gap-8">
        <div className="flex flex-col gap-2 items-center">
          <p className='text-white text-2xl font-semibold'>Join your friends and share the passion together !</p>
        <p className='text-white font-light'>But before you join, make sure to get preapered on the way !</p>
        </div>
        <div className="w-full max-w-5xl justify-between items-center gap-3 flex">
          <div className="flex flex-col gap-6 max-w-4xl max-h-96 h-full w-full">
            
            <div className='flex flex-col gap-2 relative top-0 left-0 bg-dark-gray max-w-md  rounded-lg w-full max-h-[32rem] h-full'>
            <video ref={videoReference} muted autoPlay className="w-full h-full rounded-lg max-h-80 " />
              <audio ref={audioReference}  autoPlay className="w-full h-full rounded-lg" />
                 <div className="flex absolute w-full bottom-0 left-0 p-2 items-center gap-4 justify-center">
              <button className={`text-white ${!videoReference.current && (videoReference.current && videoReference.current.srcObject==null) ? 'bg-red-400' : 'bg-primary-color'}  p-3 text-2xl rounded-full`} onClick={toggleWebCam}><FaCamera /></button>
                     <button className={`text-white ${!audioReference.current || (audioReference.current && audioReference.current.srcObject==null) ? 'bg-red-400' : 'bg-primary-color'}  p-3 text-2xl rounded-full`} onClick={toggleMicrophone}><FaMicrophone/></button>
            </div>
              </div>
                 
        
            
      

            <div className="grid grid-cols-2 gap-4 max-w-xl items-center w-full">
            <PreSetupDropDown Icon={FaMicrophone} activeDevice={false} devices={devices.microphones} onDeviceChange={ (device) => {
               selectCameraSource(device.deviceId);
            }}  />
            
              <PreSetupDropDown Icon={FaCamera} activeDevice={false} devices={devices.cameras} onDeviceChange={ (device) => {
               selectAudioDevice(device.deviceId);
            }}  />

              <PreSetupDropDown Icon={BsSpeakerFill} activeDevice={false} devices={devices.speakers} onDeviceChange={(device) => {
              console.log(device);
            }}  />
  
  
            </div>
  
          </div>
          <div className="flex flex-col max-w-xs w-full gap-3">
          <Button onClick={handleCall} additionalClasses='py-3 w-full' type='blue'>Create Meeting</Button>
        </div>
          </div>
        </div>
 
      </div>
  )
}

export default ModalPreSetup