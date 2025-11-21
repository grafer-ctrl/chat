import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Image as ImageIcon, Globe, Menu, X, BrainCircuit } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { label: 'Chat Assistant', path: '/chat', icon: MessageSquare },
    { label: 'Vision Analysis', path: '/vision', icon: ImageIcon },
    { label: 'Web Search', path: '/search', icon: Globe },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-secondary border-r border-gray-800 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <div className="flex items-center space-x-2 text-blue-400">
            <BrainCircuit size={28} />
            <span className="text-xl font-bold text-white">Gemini Suite</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close mobile menu on click
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Model</p>
            <p className="text-sm font-mono text-blue-300">gemini-2.5-flash</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;