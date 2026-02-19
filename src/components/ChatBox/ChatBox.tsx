import ChatInput from '../ChatInput/ChatInput'; // Adjust path as needed
import icon from '../../assets/icon.svg'; // Adjust path as needed
import '../../css/Global.css'
import MessageBox from '../MessageBox/MessageBox';
//import { FakeMessages } from '../../';
import { useMessages } from '../../context/MessagesContext';
import React, { useEffect } from 'react';
import { FakeMessages } from '../../data/FakeMessages';
function ChatBox() {
  
  // Array of messages in state
  //const [messages, setMessages] = useState<Message[]>(FakeMessages);
  const { messages, setMessages } = useMessages();
  /*
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages(FakeMessages);
    } 
  }, [messages.length, setMessages]);*/

 useEffect(()=>{
  setMessages(FakeMessages)
 },[]);
  return (

    <div className="chatbox-container">
         <div className="chatbox-picture">
          <div>
             <img src={icon} alt="Icon"/>
            <h2 className="picture-title">Felicia</h2>
          </div>
        </div>
      <div className="chatbox">
        
     
      <MessageBox messages={messages}/>
      </div>
      <ChatInput  />
    </div>
  );
}

export default ChatBox;