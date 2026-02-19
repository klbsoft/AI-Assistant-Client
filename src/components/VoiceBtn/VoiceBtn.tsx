import { useState, useRef } from 'react';
import { useMessages } from '../../context/MessagesContext';
import '../../css/Global.css';
import Message from '../Message/Message';
import { MessageType ,AudioData} from '../Message/Message';
import { useSettings } from '../../context/SettingsContext';


export default function VoiceBtn() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { setMessages } = useMessages(); // Get setter from context
  const startTimeRef = useRef<number | null>(null); // Track start time
  const {t} = useSettings();
  
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      startTimeRef.current = Date.now();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);

        let duration = 0;
        if (startTimeRef.current) {
          duration = (Date.now() - startTimeRef.current) / 1000; // Convert to seconds
          startTimeRef.current = null; // Reset
        }   

        const message = new Message("User",
          MessageType.Audio,
          new AudioData(audioBlob,duration)
        );
        setMessages(prev => [...prev, message]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button 
      className={`voice-button ${isRecording ? 'recording' : ''}`}
      onClick={handleClick}
      type="button"
    >
      <svg 
        className="voice-icon" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
      
      {/* Wave animation */}
      {isRecording && (
        <div className="wave-animation">
          <div className="wave-bar-recording"></div>
          <div className="wave-bar-recording"></div>
          <div className="wave-bar-recording"></div>
        </div>
      )}
      
      <span className="button-text">
        {isRecording ? `${t('RECORDING')}...` : t('ADD_AUDIO_BTN_TEXT')}
      </span>
      
      {/* Store audio for later use */}
      <div style={{ display: 'none' }}>
        {audioBlob && `Audio recorded: ${audioBlob.size} bytes`}
      </div>
    </button>
  );
}