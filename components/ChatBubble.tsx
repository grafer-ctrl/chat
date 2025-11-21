import React from 'react';
import { Message, Sender } from '../types';
import { Bot, User, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.sender === Sender.Bot;

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1
          ${isBot ? 'bg-blue-600 mr-3' : 'bg-gray-600 ml-3'}
        `}>
          {isBot ? <Bot size={18} className="text-white" /> : <User size={18} className="text-white" />}
        </div>

        {/* Bubble Content */}
        <div className={`
          p-4 rounded-2xl shadow-sm
          ${isBot 
            ? 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700' 
            : 'bg-blue-600 text-white rounded-tr-none'
          }
        `}>
          {message.imageUrl && (
            <div className="mb-3">
              <img 
                src={message.imageUrl} 
                alt="User uploaded" 
                className="max-w-full h-auto rounded-lg border border-white/20 max-h-64 object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>

          {/* Sources (Grounding) */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-600/50">
              <p className="text-xs font-semibold text-gray-400 mb-2">Sources:</p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, idx) => (
                  source.web?.uri ? (
                    <a 
                      key={idx} 
                      href={source.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-xs bg-gray-900/50 hover:bg-gray-900 text-blue-300 px-2 py-1 rounded border border-blue-500/20 transition-colors"
                    >
                      <ExternalLink size={10} className="mr-1" />
                      {source.web.title || new URL(source.web.uri).hostname}
                    </a>
                  ) : null
                ))}
              </div>
            </div>
          )}
          
          <div className={`text-[10px] mt-2 opacity-60 ${isBot ? 'text-gray-400' : 'text-blue-100'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;