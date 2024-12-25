import { useState, useRef } from "react";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [permission, setPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Function to request microphone permission if needed
  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission("granted");
      stream.getTracks().forEach(track => track.stop()); // Close the stream immediately after permission check
    } catch {
      setPermission("denied");
    }
  };

  // Start recording
  const startRecording = async () => {
    if (permission !== "granted") {
      await requestPermission();
    }
    if (permission !== "granted") return; // Stop if permission is denied

    setIsRecording(true);
    audioChunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    // Collect audio data chunks
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    // When recording stops, create the audio blob
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setAudioBlob(audioBlob);
      stream.getTracks().forEach((track) => track.stop()); // Stop audio stream
    };

    mediaRecorderRef.current.start();
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return {
    isRecording,
    audioBlob,
    permission,
    audioChunksRef,
    mediaRecorderRef,
    requestPermission,
    startRecording,
    stopRecording,
  };
};