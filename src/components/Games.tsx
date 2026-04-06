import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Brain, X, Play, Trophy, Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Game {
  id: string;
  title: string;
  icon: string;
  color: string;
  category: 'FUN' | 'BRAIN';
  description: string;
}

const GAMES: Game[] = [
  { id: "ludo", title: "Ludo", icon: "🎲", color: "bg-red-500", category: "FUN", description: "Classic board game with friends" },
  { id: "snakes", title: "Snakes & Ladders", icon: "🐍", color: "bg-green-500", category: "FUN", description: "Climb up and watch out for snakes!" },
  { id: "carrom", title: "Carrom", icon: "⚪", color: "bg-amber-700", category: "FUN", description: "Strike the coins into the pockets" },
  { id: "hockey", title: "Hockey", icon: "🏒", color: "bg-blue-500", category: "FUN", description: "Fast-paced air hockey fun" },
  { id: "ttt", title: "Tic Tac Toe", icon: "❌", color: "bg-purple-500", category: "FUN", description: "Get three in a row to win" },
  { id: "memory", title: "Memory", icon: "🧠", color: "bg-indigo-500", category: "BRAIN", description: "Find the matching pairs" },
  { id: "quiz", title: "Quiz", icon: "❓", color: "bg-orange-500", category: "BRAIN", description: "Test your knowledge" },
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <div className="flex flex-col h-full bg-green-50 overflow-y-auto">
      {/* Header */}
      <div className="p-8 md:p-12 bg-white shadow-sm space-y-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-green-500 rounded-2xl text-white">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">Games</h1>
        </div>
      </div>

      {/* Game Sections */}
      <div className="flex-1 p-8 md:p-12 space-y-16">
        <GameSection 
          title="Fun Games" 
          icon={<Star className="w-8 h-8 text-yellow-500" />}
          games={GAMES.filter(g => g.category === 'FUN')}
          onSelect={setSelectedGame}
        />

        <GameSection 
          title="Brain Games" 
          icon={<Brain className="w-8 h-8 text-indigo-500" />}
          games={GAMES.filter(g => g.category === 'BRAIN')}
          onSelect={setSelectedGame}
        />
      </div>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-12"
          >
            <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className={cn("p-8 flex items-center justify-between text-white", selectedGame.color)}>
                <div className="flex items-center gap-6">
                  <span className="text-6xl">{selectedGame.icon}</span>
                  <div>
                    <h2 className="text-4xl font-bold">{selectedGame.title}</h2>
                    <p className="text-xl opacity-80">{selectedGame.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="p-4 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                >
                  <X className="w-10 h-10" />
                </button>
              </div>
              
              <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 bg-gray-50">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-8">
                  <Play className="w-16 h-16 text-gray-400 fill-current ml-2" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Game Loading...</h3>
                <p className="text-xl text-gray-500 text-center max-w-md">
                  Yaara is setting up the {selectedGame.title} board for you. 
                  Taiyaar ho jaiye!
                </p>
                
                <button className={cn(
                  "mt-12 px-12 py-6 rounded-full text-white text-3xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all",
                  selectedGame.color
                )}>
                  Start Game
                </button>
              </div>

              <div className="p-8 border-t border-gray-100 flex items-center justify-center gap-12">
                <div className="flex items-center gap-3 text-gray-400">
                  <Trophy className="w-8 h-8" />
                  <span className="text-xl font-medium">High Score: 0</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Star className="w-8 h-8" />
                  <span className="text-xl font-medium">Level: 1</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface GameSectionProps {
  title: string;
  icon: React.ReactNode;
  games: Game[];
  onSelect: (game: Game) => void;
}

function GameSection({ title, icon, games, onSelect }: GameSectionProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 px-4">
        {icon}
        <h2 className="text-4xl font-bold text-gray-800">{title}</h2>
      </div>
      
      <div className="flex gap-8 overflow-x-auto pb-8 px-4 scrollbar-hide snap-x">
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(game)}
            className="flex-shrink-0 w-72 md:w-80 bg-white rounded-3xl p-8 shadow-xl cursor-pointer snap-start flex flex-col items-center gap-6 border-2 border-transparent hover:border-green-200 transition-all"
          >
            <div className={cn("w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-lg", game.color)}>
              {game.icon}
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900">{game.title}</h3>
              <p className="text-xl text-gray-500 mt-2 line-clamp-2">{game.description}</p>
            </div>
            <button className={cn("w-full py-4 rounded-2xl text-white text-2xl font-bold mt-2", game.color)}>
              Play
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
