import {  useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Chatbox from '../ChatBox/ChatBox';
import '../../css/Global.css';
import { useSettings,languages, LOCAL_STORAGE_KEY } from '../../context/SettingsContext';

//import { FakeMessages } from './FakeMessages'; // Your fake data


function ChatBot() {
    const settings = useSettings();
    const detectAndSetSystemLanguage = () => {
    const systemLang = navigator.language.substring(0, 2).toLowerCase();    
    const languageMap: Record<string, keyof typeof languages> = {
      'en': 'en',
      'es': 'es',
      // Add more mappings as you support more languages
      // 'fr': 'fr',
      // 'de': 'de',
      // 'ja': 'ja',
      // 'zh': 'zh',
    };
    const detectedLanguage = languageMap[systemLang] || 'en';
    if (detectedLanguage !== settings.settings.language) {
      settings.updateSetting('language', detectedLanguage);
      console.log(`System language detected: ${systemLang}, setting app to: ${detectedLanguage}`);
    }
  };
  useEffect(() => {
    const hasUserSetLanguage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!hasUserSetLanguage) {
      detectAndSetSystemLanguage();
    }
  }, []); 
  return (
    <div className="app-container">
        <Navbar />
        <div className="main-content">
        <Sidebar />
        <Chatbox />
        </div>
    </div>
  );
}

export default ChatBot;