import { useState,useEffect } from "react";
import { playAudioBlob } from "../../utils/audio/PlayAudio";
import { MessageType, AudioData, TextData  } from '../Message/Message'
import Message from "../Message/Message";
import getFileIconClass from "../../utils/string/getFileIconClass";
import formatFileSize from "../../utils/string/formatFileSize";
import {fixLongName,fixLongType} from '../../utils/string/fixLongName'
import { useSettings } from "../../context/SettingsContext";
import { handleFileDownload } from "../../utils/api/handleDownload";
import { generateWaveBars } from "../UI/generateWeveBars"
export default function MessageBox(props: { messages: Message[] }) {
    const { messages } = props;
    const [isPlaying, setPlaying] = useState<boolean>(false);
    //const [loading,setLoading] = useState(false);
    const {t}  = useSettings();
    
    /*
    useEffect(() => {
        const request = async () => {
            console.log("Starting long fetch...");
            
            const response = await fetch('http://0.0.0.0:3001/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Don't forget this!
                },
                body: JSON.stringify({ data: messages })
            });
            
            const result = await response.json();
            console.log("Fetch Result: ", result);
            return result;
        };
        request();
        },[loading]);

        */
 
    useEffect(() => {
        const request = async () => {
            console.log("Starting long fetch...");
            
            const response = await fetch('http://0.0.0.0:3001/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Don't forget this!
                },
                body: JSON.stringify({ data: messages })
            });
            
            const result = await response.json();
            console.log("Fetch Result: ", result);
            return result;
        };
        if(messages.length >= 1){
            request();
        }
        },[messages]);

         
    
    const handleVoicePlay = (index: number) => {
        if (messages[index].mtype === MessageType.Audio) {
            setPlaying(true);
            console.log('Playing voice message', index);
          
            const audio = ((messages[index].data as AudioData).audio) as Blob; 
        
            playAudioBlob(audio, () => {
                setPlaying(false);
            });
        }
    };



    return (
        <div className="chat-messages">
            {messages.map((msg, index) => {
                const ownerClass = msg.owner === "User" ? "user" : 
                                msg.owner === "Assistant" ? "assistant" : 
                                msg.owner.toLowerCase();
                
                const isVoice = msg.mtype === MessageType.Audio;
                const isText = msg.mtype === MessageType.Text;
                
                // Voice messages
                if (isVoice) {
                    const audioData = msg.data as AudioData;
                    return (
                        <div key={index} className={`message voice ${ownerClass}`}>
                            <strong>{msg.owner}: </strong>
                            <div className="voice-message-container">
                                <button 
                                    className="voice-play-button"
                                    onClick={() => handleVoicePlay(index)}
                                    aria-label="Play voice message"
                                >
                                    {isPlaying === true ? '||' : '▶'} 
                                </button>
                                <div className="voice-info">
                                    <span>{t('VOICE_MESSAGE')}</span>
                                    {audioData.duration && (
                                        <div className="voice-duration">
                                        {t('DURATION')}: {audioData.duration.toPrecision(2)}s
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="audio-wave">
                                {generateWaveBars()}
                            </div>
                        </div>
                    );
                }
                
                // Text messages (may have files)
                if (isText) {
                    const textData = msg.data as TextData;
                    const hasFiles = textData.files && textData.files.length > 0;
                    
                    return (
                        <div key={index} className={`message ${ownerClass} ${hasFiles ? 'with-files' : ''}`}>
                            <strong>{msg.owner}: </strong>
                            <span>{textData.text}</span>
                            
                            {/* Display attached files if they exist */}
                            {hasFiles && (
                                <div className="attached-files-container">
                                    <div className="files-header">
                                        <span>{t('ATTACHMENTS')} ({textData.files.length})</span>
                                    </div>
                                    <div className="files-grid">
                                        {textData.files.map((file, fileIndex) => (
                                            <div key={fileIndex} className="file-attachment">
                                                <div className="file-icon-container">
                                                    <svg 
                                                        className={`file-icon ${getFileIconClass(file.name)}`}
                                                        viewBox="0 0 24 24" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2" 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                    </svg>
                                                </div>
                                                <div className="file-info">
                                                    <div className="file-name">
                                                        {fixLongName(file.name)}
                                                    </div>
                                                    <div className="file-details">
                                                        <span className="file-size">
                                                            {formatFileSize(file.size)}
                                                        </span>
                                                        <span className="file-type">
                                                            {fixLongType(file.type)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="file-download-button"
                                                    onClick={() => handleFileDownload(file, file.name)}
                                                    aria-label={`Download ${file.name}`}
                                                >
                                                    <svg 
                                                        className="download-icon" 
                                                        viewBox="0 0 24 24" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2" 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }
                
                // Fallback (shouldn't happen with your enum)
                return;
            })}
        </div>
    );
}