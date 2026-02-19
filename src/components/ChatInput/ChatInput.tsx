// ChatInput.jsx
import VoiceBtn from '../VoiceBtn/VoiceBtn';
import '../../css/Global.css'
import TextInput from '../TextInput/TextInput';

function ChatInput() {
  return (
    <div className="chat-input-container">
      <TextInput/>
      <VoiceBtn/>
    </div>
  );
}

export default ChatInput;