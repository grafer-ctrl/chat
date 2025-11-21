import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import VisionPage from './pages/VisionPage';
import SearchPage from './pages/SearchPage';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // CRITICAL: Using HashRouter instead of BrowserRouter ensures compatibility with GitHub Pages
    <HashRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-dark text-gray-100 font-sans">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="flex-1 flex flex-col h-full relative w-full">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center p-4 bg-secondary border-b border-gray-800">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-300 hover:text-white mr-4"
            >
              <Menu size={24} />
            </button>
            <span className="font-semibold text-lg">Gemini Suite</span>
          </div>

          {/* Page Content */}
          <div className="flex-1 p-4 md:p-6 overflow-hidden max-w-6xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/vision" element={<VisionPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;