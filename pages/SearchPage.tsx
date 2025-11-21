import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Message, Sender } from '../types';
import ChatBubble from '../components/ChatBubble';
import { searchWithGrounding } from '../services/geminiService';

const SearchPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      text: "I can browse the web for real-time information. Try asking about recent events.",
      sender: Sender.Bot,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
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
      const { text, sources } = await searchWithGrounding(userMsg.text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: text,
        sender: Sender.Bot,
        timestamp: new Date(),
        sources: sources.map(s => ({ uri: s.web?.uri || '', title: s.web?.title || 'Source' })).filter(s => s.uri)
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Search failed. Please check your API limits or connection.",
        sender: Sender.Bot,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">Web Search Grounding</h1>
        <p className="text-gray-400 text-sm">Real-time information from Google Search</p>
      </header>

      <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800 p-4 overflow-y-auto">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center justify-center h-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search the web..."
            className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 shadow-lg"
          />
          <SearchIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <button
            onClick={handleSearch}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;