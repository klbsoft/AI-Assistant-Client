import {  useRef , useState ,type ChangeEvent} from 'react';
import ArrowSvg from "../UI/ArrowSvg"
import Message from "../Message/Message";
import { useMessages } from "../../context/MessagesContext";
import { MessageType } from '../Message/Message';
import { TextData } from '../Message/Message';
import {  useSettings } from '../../context/SettingsContext';




export default function TextInput() {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [text,setText] = useState<string>('');
  const { setMessages } = useMessages(); // Get setter from context
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {t} = useSettings();

  
  const maxHeight = 120*3; // Max height in pixels (approx 4 rows)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //setReset(false);
  const textarea = e.currentTarget;
    
    // Reset to auto height first
    textarea.style.height = 'auto';
    
    // Set to scrollHeight, but cap at maxHeight
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    setText(textareaRef.current?.value);

  };
   const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles) {
        const newFiles = Array.from(selectedFiles);
        const updatedFiles = [...attachedFiles, ...newFiles];
        
        setAttachedFiles(updatedFiles);
        // Reset input to allow selecting same files again
        e.target.value = '';
      }
    };
  

    const clearInput = () => {
      setText('');
      // Also reset the height
      if (textareaRef.current) {
        textareaRef.current.value ='';
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus(); // Optional: keep focus
      }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // Prevent default new line
          sendIt(); // Call your send function
        }
        // If Shift+Enter, allow normal new line behavior
      };
      const sendIt = ()=>{
        clearInput();
        //console.log("SentFiles",attachedFiles)
        if (text.trim()) {
        // Add to messages via context
        
        const newMessage = new Message("User",
          MessageType.Text,
          new TextData(text,attachedFiles)
        )
        setAttachedFiles([]);
       // setReset(true);
        setMessages(prev => [...prev, newMessage]);
        }
    }

  return (
  <>
          <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        style={{ display: 'none' }}
      />
      
      <button 
        className="attachment-button"
        type="button"
        onClick={handleButtonClick}
      >
        <svg 
          className="attachment-icon" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
        </svg>
        <span className="button-text">
          {attachedFiles.length === 0 ? t('ADD_FILE_BTN_TEXT') : t('FILES_SELECTED',{count: attachedFiles.length})}
        </span>
      </button>
    </>

      <div className="text-input-wrapper">
      <textarea
        ref={textareaRef}
        className="chat-input-field"
        placeholder={t('ASK_FOR_SOMETHING')}
        onChange={handleChange}
        onKeyDown={handleKeyDown}  // Add this
        style={{
          resize: 'none',
          overflow: 'hidden',
          minHeight: 'auto',
        }}
      />
      <button
        onClick={sendIt}
        className="send-button" >
            <ArrowSvg className="send-icon" />
      </button>
    </div>
    </>
  );
}