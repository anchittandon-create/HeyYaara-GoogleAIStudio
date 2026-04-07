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
  { id: "ttt", title: "Tic Tac Toe", icon: "❌", color: "bg-purple-500", category: "FUN", description: "Get three in a row to win" },
  { id: "quiz", title: "Quiz", icon: "❓", color: "bg-orange-500", category: "BRAIN", description: "Test your knowledge" },
  { id: "ludo", title: "Ludo", icon: "🎲", color: "bg-red-500", category: "FUN", description: "Classic board game with friends" },
  { id: "snakes", title: "Snakes & Ladders", icon: "🐍", color: "bg-green-500", category: "FUN", description: "Climb up and watch out for snakes!" },
  { id: "carrom", title: "Carrom", icon: "⚪", color: "bg-amber-700", category: "FUN", description: "Strike the coins into the pockets" },
  { id: "hockey", title: "Hockey", icon: "🏒", color: "bg-blue-500", category: "FUN", description: "Fast-paced air hockey fun" },
  { id: "memory", title: "Memory", icon: "🧠", color: "bg-indigo-500", category: "BRAIN", description: "Find the matching pairs" },
];

const QUIZ_QUESTIONS = [
  { q: "Who is known as the Nightingale of India?", options: ["Lata Mangeshkar", "Asha Bhosle", "Sarojini Naidu", "Shreya Ghoshal"], a: 0 },
  { q: "Which city is known as the Pink City?", options: ["Jaipur", "Jodhpur", "Udaipur", "Bikaner"], a: 0 },
  { q: "What is the national flower of India?", options: ["Rose", "Lotus", "Lily", "Sunflower"], a: 1 },
  { q: "Who wrote the Indian National Anthem?", options: ["Rabindranath Tagore", "Bankim Chandra", "Mahatma Gandhi", "Subhash Chandra Bose"], a: 0 },
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  // Tic Tac Toe State
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const handleSquareClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const handleAnswerClick = (index: number) => {
    if (index === QUIZ_QUESTIONS[currentQuestion].a) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < QUIZ_QUESTIONS.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

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
              
              <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center p-12 bg-gray-50">
                {selectedGame.id === 'ttt' ? (
                  <div className="flex flex-col items-center gap-8">
                    <div className="text-3xl font-bold text-gray-800 mb-4">
                      {winner ? `Winner: ${winner}!` : isDraw ? "It's a Draw!" : `Next Player: ${isXNext ? 'X' : 'O'}`}
                    </div>
                    <div className="grid grid-cols-3 gap-4 bg-gray-200 p-4 rounded-3xl shadow-inner">
                      {board.map((square, i) => (
                        <button
                          key={i}
                          onClick={() => handleSquareClick(i)}
                          className={cn(
                            "w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center text-6xl font-bold shadow-md transition-all active:scale-95",
                            square === 'X' ? "text-blue-600" : "text-red-600",
                            !square && !winner && "hover:bg-gray-50"
                          )}
                        >
                          {square}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={resetGame}
                      className={cn("mt-8 px-12 py-6 rounded-full text-white text-3xl font-bold shadow-xl transition-all", selectedGame.color)}
                    >
                      Reset Game
                    </button>
                  </div>
                ) : selectedGame.id === 'quiz' ? (
                  <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                    {showScore ? (
                      <div className="text-center space-y-6">
                        <div className="text-6xl font-bold text-gray-900">Score: {score}/{QUIZ_QUESTIONS.length}</div>
                        <p className="text-2xl text-gray-500">Shabaash! Bahut badhiya khele aap.</p>
                        <button 
                          onClick={resetGame}
                          className={cn("mt-8 px-12 py-6 rounded-full text-white text-3xl font-bold shadow-xl transition-all", selectedGame.color)}
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <div className="w-full space-y-8">
                        <div className="text-2xl font-bold text-gray-400 uppercase tracking-widest">
                          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                        </div>
                        <div className="text-4xl font-bold text-gray-900 leading-tight">
                          {QUIZ_QUESTIONS[currentQuestion].q}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {QUIZ_QUESTIONS[currentQuestion].options.map((option, i) => (
                            <button
                              key={i}
                              onClick={() => handleAnswerClick(i)}
                              className="w-full p-6 text-left text-2xl font-semibold bg-white border-4 border-gray-100 rounded-3xl hover:border-orange-500 hover:bg-orange-50 transition-all active:scale-95"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
