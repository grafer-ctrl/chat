import React, { useState, useRef } from 'react';
import { Upload, ImagePlus, X } from 'lucide-react';
import { Message, Sender } from '../types';
import ChatBubble from '../components/ChatBubble';
import { analyzeImage } from '../services/geminiService';

const VisionPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      text: "Upload an image and I'll analyze it for you.",
      sender: Sender.Bot,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    // Construct user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input || (selectedFile ? "Analyze this image" : ""),
      sender: Sender.User,
      timestamp: new Date(),
      imageUrl: previewUrl || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Store file and clear input UI states immediately for better UX
    const fileToAnalyze = selectedFile;
    const promptToAnalyze = input;
    
    setInput('');
    clearFile();
    setIsLoading(true);

    try {
      let responseText = "";
      if (fileToAnalyze) {
        responseText = await analyzeImage(fileToAnalyze, promptToAnalyze);
      } else {
         responseText = "Please upload an image for vision analysis.";
      }
      
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
        text: "Failed to analyze image. Please try again.",
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
        <h1 className="text-2xl font-bold text-white">Vision Analysis</h1>
        <p className="text-gray-400 text-sm">Multimodal capabilities with Gemini</p>
      </header>

      <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800 p-4 overflow-y-auto">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm ml-12 animate-pulse">Analyzing image...</div>
        )}
      </div>

      <div className="mt-4">
        {/* Image Preview Area */}
        {previewUrl && (
          <div className="mb-2 inline-block relative">
            <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-blue-500/30" />
            <button 
              onClick={clearFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 border border-gray-700 transition-colors"
            title="Upload Image"
          >
            <ImagePlus size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedFile ? "Ask about the image..." : "Upload an image first"}
              className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!selectedFile && !input)}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionPage;