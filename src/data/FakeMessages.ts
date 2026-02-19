// fakeMessages.ts
import { MessageType, TextData } from '../components/Message/Message';
import Message from '../components/Message/Message';

export const FakeMessages: Message[] = [
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("Welcome to the chat! How can I help you today?")
  ),
  new Message(
    "User", 
    MessageType.Text,
    new TextData("Hello there! I need some help with my project.")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("I'd be happy to help! What kind of project are you working on?")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("It's a React TypeScript application for managing tasks.")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("That sounds interesting. What specific help do you need?")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("I'm having trouble with state management and TypeScript types.")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("I can assist with that. Are you using useState hooks or a state management library?")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("Just useState hooks for now, but I'm considering Redux Toolkit.")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("Redux Toolkit is a great choice for complex state. Have you tried React Query for server state?")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("Not yet, but I've heard good things about it. Is it difficult to learn?")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("It has a learning curve but it's worth it. The documentation is excellent.")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("Okay, I'll check it out. Can you help me with TypeScript interfaces?")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("Absolutely! What issues are you facing with TypeScript?")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("I'm getting type errors when passing props between components.")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("Make sure you're defining proper interfaces for your props. Can you show me an example?")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("I'll share the code in a moment. First, what's the best way to organize TypeScript types?")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("I recommend creating a separate types.ts file or using module-level type definitions.")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("That makes sense. What about handling async operations with TypeScript?")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("You can use async/await with try-catch blocks, and properly type your promises.")
  ),
  new Message(
    "User",
    MessageType.Text,
    new TextData("Thanks for the help! This has been very informative.")
  ),
  new Message(
    "Assistant",
    MessageType.Text,
    new TextData("You're welcome! Feel free to ask if you have more questions. Happy coding!")
  )
];