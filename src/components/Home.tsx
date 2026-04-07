import React from 'react';
import { motion } from 'motion/react';
import { Mic, Music, Gamepad2, MessageCircle } from 'lucide-react';
import VoiceOrb from './VoiceOrb';
import { AppState } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface HomeProps {
  onNavigate: (state: AppState) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const suggestions = [
    { text: "Aapko bhajan sunna hai?", action: () => onNavigate('MUSIC') },
    { text: "Chaliye baat karte hain", action: () => onNavigate('TALK') },
    { text: "Ludo khelna hai?", action: () => onNavigate('GAMES') },
  ];

  return (
    <div className="flex flex-col items-center justify-between min-h-full p-8 md:p-12 lg:p-16 bg-gradient-to-b from-orange-50 to-white">
      {/* Greeting Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-orange-900 tracking-tight">
          Namaste, aapki Yaara.
        </h1>
        <p className="text-3xl md:text-4xl text-orange-700 font-medium">
          Yeh aapka soft space hai — boliye, suniye, ya phir gaana suniye. Sab kuch simple, warm aur aapke liye tailored.
        </p>
      </motion.div>

      {/* Main Action: Voice Orb */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-8"
      >
        <VoiceOrb 
          state="IDLE" 
          onClick={() => onNavigate('TALK')}
          className="w-64 h-64 md:w-80 md:h-80"
        />
        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Talk to Yaara</h2>
          <p className="text-2xl md:text-3xl text-gray-500 italic">"Bas bolo… main sun raha hoon"</p>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-12">
        <ActionButton 
          icon={<Mic className="w-10 h-10" />} 
          label="Talk" 
          color="bg-blue-500"
          onClick={() => onNavigate('TALK')}
        />
        <ActionButton 
          icon={<Music className="w-10 h-10" />} 
          label="Music" 
          color="bg-pink-500"
          onClick={() => onNavigate('MUSIC')}
        />
        <ActionButton 
          icon={<Gamepad2 className="w-10 h-10" />} 
          label="Games" 
          color="bg-green-500"
          onClick={() => onNavigate('GAMES')}
        />
      </div>

      {/* Suggestions Section */}
      <div className="w-full max-w-4xl mt-12 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-400 uppercase tracking-widest text-center">Suggestions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={s.action}
              className="px-8 py-4 bg-white border-2 border-orange-100 rounded-full text-2xl font-medium text-orange-800 shadow-sm hover:shadow-md transition-all"
            >
              {s.text}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

function ActionButton({ icon, label, color, onClick }: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-6 p-8 rounded-3xl text-white shadow-xl transition-all",
        color
      )}
    >
      {icon}
      <span className="text-4xl font-bold">{label}</span>
    </motion.button>
  );
}
