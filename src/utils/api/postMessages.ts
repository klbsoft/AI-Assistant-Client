import Message from "../../components/Message/Message";
import { MessageType,TextData,AudioData } from "../../components/Message/Message";

export async function postMessage(message: Message) {
  const formData = new FormData();
  
  // Add basic message info as JSON
  const messageInfo = {
    owner: message.owner,
    mtype: message.mtype,
  };
  formData.append('messageInfo', JSON.stringify(messageInfo));
  
  // Handle TextData
  if (message.mtype === MessageType.Text) {
    const textData = message.data as TextData;
    
    // Add text
    formData.append('text', textData.text);
    
    // Add files if they exist
    if (textData.files && textData.files.length > 0) {
      textData.files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
    }
  }
  
  // Handle AudioData
  else if (message.mtype === MessageType.Audio) {
    const audioData = message.data as AudioData;
    
    // Add audio blob as a file
    const audioBlob = audioData.audio;
    formData.append('audio', audioBlob, 'audio_recording.wav');
    
    // Add duration as metadata
    formData.append('duration', audioData.duration.toString());
  }
  
  // Send the request
  const response = await fetch('/api/messages', {
    method: 'POST',
    body: formData, // No Content-Type header needed - browser sets it automatically
  });
  
  return await response.json();
}