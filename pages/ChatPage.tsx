import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Message, Sender } from '../types';
import ChatBubble from '../components/ChatBubble';
import { sendTextMessage } from '../services/geminiService';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello! I'm powered by Gemini 2.5 Flash. Ask me anything.",
      sender: Sender.Bot,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: Sender.User,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendTextMessage(userMsg.text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: Sender.Bot,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error processing your request. Please check your API Key.",
        sender: Sender.Bot,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">Chat Assistant</h1>
        <p className="text-gray-400 text-sm">General purpose conversational AI</p>
      </header>

      <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800 p-4 overflow-y-auto relative">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center text-gray-500 text-sm ml-12 mb-4">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1 delay-75"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            <span className="ml-2">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-gray-700 shadow-inner h-14"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-2 p-2 rounded-md transition-all
              ${!input.trim() || isLoading ? 'text-gray-500 bg-transparent cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'}
            `}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;