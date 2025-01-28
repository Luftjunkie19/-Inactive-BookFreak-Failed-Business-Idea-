'use client'; 
import { CameraDeviceInfo, createCameraVideoTrack, createMicrophoneAudioTrack, MicrophoneDeviceInfo, useMediaDevice, useMeeting } from '@videosdk.live/react-sdk'
import { PlaybackDeviceInfo } from '@videosdk.live/react-sdk/dist/types/deviceInfo'
import { DevicesMap } from 'components/TopBar/UserChatTopBar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IconBaseProps, IconType } from 'react-icons'
import { FaCamera, FaCameraRetro, FaMicrophone, FaPlay, FaTrash } from 'react-icons/fa6'
import PreSetupDropDown from './PreSetupDropDown'
import { CgMusicSpeaker } from 'react-icons/cg'
import { BsSpeakerFill } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Button from 'components/buttons/Button'
import { FaPause } from 'react-icons/fa'
import { Permission } from '@videosdk.live/react-sdk/dist/types/permission';




type Props = {

  isSetupOpen: boolean,
  setMicState:(data:boolean)=>void,
micState:boolean,
  handleCall: () => void,
  setIsCameraOn: (data: boolean) => void,
  isCameraOn:boolean

}

function ModalPreSetup({ isSetupOpen,setIsCameraOn,isCameraOn, handleCall, micState, setMicState}: Props) {
  

  const { checkPermissions, requestPermission, getCameras, getMicrophones, getDevices, getPlaybackDevices } = useMediaDevice({
    onDeviceChanged(devices) {
      console.log(devices);
    },
  });


  const [selectedWebCamId, setSelectedWebCamId] = useState<string>();
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>();
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>();
  const [devices, setDevices] = useState<DevicesMap>({
    cameras: [],
    microphones: [],
    speakers: [],
  });

  const videoReference = useRef<HTMLVideoElement>(null);
  const audioReference = useRef<HTMLAudioElement>(null);
  const testSoundReference = useRef<HTMLAudioElement>(null);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<MediaStream>();
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<MediaStream>();

  const selectCameraSource= (webCamID:string)=>{
    //For Getting Video Tracks
    setSelectedWebCamId(webCamID);
  }
  const selectAudioDevice =  (selectedMicId: string) => {

        setSelectedMicrophoneId(selectedMicId);

  }

  const selectSpeakers= (selectSpeakerId: string) => {
    setSelectedSpeakerId(selectSpeakerId);
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


  const checkMediaPermission = async () => {
    try {
     
      const permissionsAudioVideoCheck =await checkPermissions('audio_video' as Permission); //For getting video permissions

      return permissionsAudioVideoCheck;
    } catch (err) {
      console.log(err);
    }
  };

  const loadDevices = async () => {
    try {
      const permissions = await checkMediaPermission();
      
      if (!permissions?.get('audio') || !permissions?.get('video')) { 
       await requestPermission('audio_video' as Permission);
      }

      const promises = await Promise.all([getCameras(),
      getMicrophones(),
      getPlaybackDevices()]);
   
       setDevices({
         cameras: promises[0],
         microphones: promises[1],
         speakers: promises[2],
       });
  
      
    
  }catch(err){
      console.log(err);
  }
    
  }

  const requestPermissions = async () => {
    try {

      await Promise.all([
      requestPermission('audio' as Permission),
   requestPermission('video' as Permission)
   ]);

    }catch(err){
      console.log(err);
    }
  }

const {join}=useMeeting();


  const toggleMicrophone = async () => {
setMicState(!micState);
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
  setIsCameraOn(!isCameraOn);
    if (videoReference.current) {
      if (videoReference.current.srcObject) {
        videoReference.current.srcObject = null;
      }
else{
      await getSelectedWebCam();
    }
    }
  }

useEffect(()=>{
  requestPermissions();
  loadDevices();

},[])

  useEffect(() => {

    getSelectedWebCam();
    getSelectedMicrophone();
  }, []);



const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
    const [audioFile, setAudioFile]=useState<HTMLAudioElement>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);



    const startRecording = async () => {
    try {
      // Request access to the microphone
    
      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(audioReference.current?.srcObject as MediaStream);

      // Event: When data is available (i.e., recording is ongoing)
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // Event: When recording stops
      mediaRecorderRef.current.onstop = () => {
        // Combine recorded chunks into a single Blob
        const recordedBlob = new Blob(recordedChunksRef.current, {
          type: "audio/wav",
        });

        // Create a URL for the recorded audio
        const audioUrl = URL.createObjectURL(recordedBlob);
        setRecordedAudio(audioUrl);
        setAudioFile(new Audio(audioUrl));

        // Clean up
        recordedChunksRef.current = [];
        
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone or starting recording:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  

  const testSpeakers = () => {
 if(testSoundReference.current){
   testSoundReference.current.play();
 }
};

 
  
  return (
    <div className={`w-full transition-all ${isSetupOpen ? ` opacity-100 scale-100` : ' -z-10 opacity-0 scale-50'}  bg-secondary-color/95 flex flex-col gap-2`}>

      

       
      <div className="flex flex-col max-w-5xl h-full w-full mx-auto justify-center items-center gap-12">
        <div className="flex flex-col gap-2 items-center">
          <p className='text-white text-2xl font-semibold'>Join your friends and share the passion together !</p>
        <p className='text-white font-light'>But before you join, make sure to get preapered on the way !</p>
        </div>
        <div className="w-full max-w-6xl justify-between items-center gap-3 flex">
          <div className="flex flex-col gap-6 max-w-4xl max-h-96 h-full w-full">
            
            <div className='flex flex-col gap-2 relative top-0 left-0 bg-dark-gray max-w-md rounded-lg w-full max-h-80'>
            <video ref={videoReference} muted autoPlay className="w-full h-full " />
              <audio ref={audioReference} muted  autoPlay className="w-full h-full rounded-lg" />
                 <div className="flex absolute w-full bottom-0 left-0 p-2 items-center gap-4 justify-center">
              <button className={`text-white ${!videoReference.current || (videoReference.current && videoReference.current.srcObject === null) ? 'bg-red-400' : 'bg-primary-color'}  p-3 text-2xl rounded-full`} onClick={toggleWebCam}><FaCamera /></button>
                     <button className={`text-white ${!audioReference.current || (audioReference.current && audioReference.current.srcObject===null) ? 'bg-red-400' : 'bg-primary-color'}  p-3 text-2xl rounded-full`} onClick={toggleMicrophone}><FaMicrophone/></button>
            </div>
              </div>

            {devices &&
            <div className="grid grid-cols-2 gap-4 max-w-xl items-center w-full">
            <PreSetupDropDown bottomManager={ <div className='flex items-center justify-between p-2 gap-2 border-t-2 border-primary-color'>
            {!isRecording && !audioFile &&   (
        <button className='text-white text-2xl' onClick={startRecording}><FaMicrophone/></button>
      )}
                {
                  isRecording && !audioFile && (
        <button className='text-red-400 bg-white rounded-lg text-2xl p-2' onClick={stopRecording}><FaMicrophone/></button>
                )
      }

      {audioFile && (
                  <>
                    <button className='text-white text-2xl' onClick={() => audioFile.play()} >
                      {audioFile.paused ? <FaPlay/> : <FaPause/>}
                   </button>

                    <button className='text-red-400 text-2xl' onClick={()=>{setAudioFile(undefined)}} ><FaTrash/></button>
                  </>
      )}

             
          
        </div>} Icon={FaMicrophone} activeDevice={false} devices={devices.microphones} onDeviceChange={ (device) => {
               selectCameraSource(device.deviceId);
            }}  />
            
              <PreSetupDropDown Icon={FaCamera} activeDevice={false} devices={devices.cameras} onDeviceChange={ (device) => {
               selectAudioDevice(device.deviceId);
            }}  />

              <PreSetupDropDown bottomManager={<div>
                <Button type="transparent" additionalClasses="text-white" onClick={testSpeakers}>Test Speakers</Button>
                <audio ref={testSoundReference} src={'/sounds/TestSound.mp3'}/>
              </div>} Icon={BsSpeakerFill} activeDevice={false} devices={devices.speakers} onDeviceChange={(device) => {
                selectSpeakers(device.deviceId);
            }}  />
  
  
            </div>
            }
  
          </div>
          <div className="flex flex-col max-w-xs w-full gap-3">
            <Button onClick={() => {
              handleCall();
              join();
          }} additionalClasses='py-3 w-full' type='blue'>Join Meeting</Button>
        </div>
          </div>
        </div>
 
      </div>
  )
}

export default ModalPreSetup