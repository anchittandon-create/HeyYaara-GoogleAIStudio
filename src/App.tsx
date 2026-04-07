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
        return <Music initialQuery={extraData?.query} />;
      case 'GAMES':
        return <Games initialGameId={extraData?.gameId} />;
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
        <nav className="h-32 md:h-40 bg-white border-t-4 border-gray-100 flex items-stretch justify-around px-4 md:px-12 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
          <NavButton 
            active={currentState === 'HOME'} 
            onClick={() => setCurrentState('HOME')}
            icon={<HomeIcon className="w-10 h-10 md:w-12 md:h-12" />}
            label="Home"
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <NavButton 
            active={currentState === 'TALK'} 
            onClick={() => setCurrentState('TALK')}
            icon={<Mic className="w-10 h-10 md:w-12 md:h-12" />}
            label="Talk"
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <NavButton 
            active={currentState === 'MUSIC'} 
            onClick={() => setCurrentState('MUSIC')}
            icon={<MusicIcon className="w-10 h-10 md:w-12 md:h-12" />}
            label="Music"
            color="text-pink-600"
            bgColor="bg-pink-50"
          />
          <NavButton 
            active={currentState === 'GAMES'} 
            onClick={() => setCurrentState('GAMES')}
            icon={<Gamepad2 className="w-10 h-10 md:w-12 md:h-12" />}
            label="Games"
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </nav>
      )}

      {/* Back Button for non-home screens (optional, but helpful) */}
      {currentState !== 'HOME' && currentState !== 'TALK' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setCurrentState('HOME')}
          className="fixed top-8 left-8 z-[60] p-6 bg-white/80 backdrop-blur-md border-2 border-gray-100 rounded-full shadow-xl text-gray-900 hover:bg-white transition-all active:scale-90"
        >
          <ChevronLeft className="w-10 h-10" />
        </motion.button>
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
        "flex-1 flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden",
        active ? color : "text-gray-400"
      )}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className={cn("absolute inset-2 md:inset-4 rounded-3xl -z-10", bgColor)}
        />
      )}
      {icon}
      <span className="text-2xl md:text-3xl font-bold">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className={cn("absolute bottom-0 left-1/4 right-1/4 h-2 rounded-t-full", color.replace('text-', 'bg-'))}
        />
      )}
    </button>
  );
}

