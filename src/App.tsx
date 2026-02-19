import { MessagesProvider} from './context/MessagesContext';
import { SettingsProvider } from './context/SettingsContext';
import ChatBot from './components/ChatBot/ChatBot';


function App() {
  return (
      <SettingsProvider>
        <MessagesProvider>
            <ChatBot/>
        </MessagesProvider>
      </SettingsProvider>
  );
}
export default App;