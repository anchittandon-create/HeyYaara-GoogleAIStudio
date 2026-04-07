/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home as HomeIcon, Mic, Music as MusicIcon, Gamepad2, ChevronLeft } from 'lucide-react';
import Home from './components/Home';
import Talk from './components/Talk';
import Music from './components/Music';
import Games from './components/Games';
import { AppState } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('HOME');
  const [extraData, setExtraData] = useState<any>(null);

  const handleNavigate = (state: AppState, extra?: any) => {
    setCurrentState(state);
    setExtraData(extra);
  };

  const renderContent = () => {
    switch (currentState) {
      case 'HOME':
        return <Home onNavigate={handleNavigate} />;
      case 'TALK':
        return <Talk onEnd={() => setCurrentState('HOME')} onNavigate={handleNavigate} />;
      case 'MUSIC':
        return <Music initialQuery={extraData?.query} onNavigate={handleNavigate} />;
      case 'GAMES':
        return <Games initialGameId={extraData?.gameId} onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden select-none">
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentState}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Bar - Only show when not in TALK mode to keep focus */}
      {currentState !== 'TALK' && (
        <nav className="h-24 md:h-28 bg-white border-t-2 border-gray-100 flex items-stretch justify-around px-4 md:px-12 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
          <NavButton 
            active={currentState === 'HOME'} 
            onClick={() => setCurrentState('HOME')}
            icon={<HomeIcon className="w-8 h-8 md:w-9 md:h-9" />}
            label="Home"
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <NavButton 
            active={currentState === 'TALK'} 
            onClick={() => setCurrentState('TALK')}
            icon={<Mic className="w-8 h-8 md:w-9 md:h-9" />}
            label="Talk"
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <NavButton 
            active={currentState === 'MUSIC'} 
            onClick={() => setCurrentState('MUSIC')}
            icon={<MusicIcon className="w-8 h-8 md:w-9 md:h-9" />}
            label="Music"
            color="text-pink-600"
            bgColor="bg-pink-50"
          />
          <NavButton 
            active={currentState === 'GAMES'} 
            onClick={() => setCurrentState('GAMES')}
            icon={<Gamepad2 className="w-8 h-8 md:w-9 md:h-9" />}
            label="Games"
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </nav>
      )}
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
}

function NavButton({ active, onClick, icon, label, color, bgColor }: NavButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden",
        active ? color : "text-gray-400"
      )}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className={cn("absolute inset-1 md:inset-2 rounded-2xl -z-10", bgColor)}
        />
      )}
      {icon}
      <span className="text-xl md:text-2xl font-bold">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className={cn("absolute bottom-0 left-1/4 right-1/4 h-1.5 rounded-t-full", color.replace('text-', 'bg-'))}
        />
      )}
    </button>
  );
}

