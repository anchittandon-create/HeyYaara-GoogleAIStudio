import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Brain, X, Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Game } from '../types';

const GAMES: Game[] = [
  // Fun Games
  { id: "ttt", title: "Tic Tac Toe", icon: "❌", color: "bg-purple-500", category: "FUN", description: "Three in a row", isLocal: true },
  { id: "snake", title: "Snake", icon: "🐍", color: "bg-green-500", category: "FUN", description: "Eat and grow", isLocal: true },
  { id: "pacman", title: "Pacman", icon: "🟡", color: "bg-yellow-500", category: "FUN", description: "Eat the dots", url: "https://www.google.com/logos/2010/pacman10-i.html" },
  
  // Brain Games
  { id: "memory", title: "Memory Game", icon: "🧠", color: "bg-indigo-500", category: "BRAIN", description: "Match the pairs", isLocal: true },
  { id: "sudoku", title: "Sudoku", icon: "🔢", color: "bg-orange-500", category: "BRAIN", description: "Number puzzle", isLocal: true },
];

export default function Games({ initialGameId }: { initialGameId?: string }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Handle initial game selection from voice
  useEffect(() => {
    if (initialGameId) {
      const game = GAMES.find(g => g.id === initialGameId);
      if (game) setSelectedGame(game);
    }
  }, [initialGameId]);

  return (
    <div className="flex flex-col h-full bg-[#F5F9FF] overflow-hidden">
      {/* Header - Compact */}
      <div className="px-8 py-4 md:py-6 bg-white border-b-2 border-blue-50 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4 pl-20 md:pl-24">
          <div className="p-3 bg-green-500 rounded-2xl text-white">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Games</h1>
            <p className="text-lg text-gray-500">Masti aur Brain Exercise!</p>
          </div>
        </div>
      </div>

      {/* Game Sections - Compact to avoid vertical scroll */}
      <div className="flex-1 flex flex-col justify-center p-4 md:p-8 gap-8 overflow-y-auto scrollbar-hide">
        <GameSection 
          title="Fun Games" 
          icon={<Star className="w-8 h-8 text-yellow-500 fill-current" />}
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
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
          >
            <div className="relative w-full h-full max-w-7xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
              <div className={cn("p-6 flex items-center justify-between text-white", selectedGame.color)}>
                <div className="flex items-center gap-6">
                  <span className="text-5xl">{selectedGame.icon}</span>
                  <h2 className="text-3xl font-bold">{selectedGame.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="p-4 bg-white/20 hover:bg-white/40 rounded-full transition-all active:scale-90"
                >
                  <X className="w-10 h-10" />
                </button>
              </div>
              
              <div className="flex-1 bg-gray-100 relative overflow-auto flex items-center justify-center">
                {selectedGame.isLocal ? (
                  <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-white overflow-auto">
                    {selectedGame.id === 'ttt' && <TicTacToe />}
                    {selectedGame.id === 'memory' && <MemoryGame />}
                    {selectedGame.id === 'snake' && <SnakeGame />}
                    {selectedGame.id === 'sudoku' && <SudokuGame />}
                  </div>
                ) : (
                  <iframe 
                    src={selectedGame.url}
                    className="w-full h-full border-none"
                    title={selectedGame.title}
                    allow="autoplay; fullscreen"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Local Game Components ---

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  
  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
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
  const isDraw = !winner && board.every(s => s !== null);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center gap-8 md:gap-10 max-w-full">
      <div className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
        {winner ? `Winner: ${winner}` : isDraw ? "It's a Draw!" : `Next Player: ${isXNext ? 'X' : 'O'}`}
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-24 h-24 md:w-40 md:h-40 bg-gray-50 border-4 border-gray-200 rounded-3xl text-5xl md:text-6xl font-bold flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-95"
          >
            <span className={val === 'X' ? 'text-red-500' : 'text-blue-500'}>{val}</span>
          </button>
        ))}
      </div>
      <button 
        onClick={reset}
        className="px-10 py-5 md:px-12 md:py-6 bg-green-500 text-white text-2xl md:text-3xl font-bold rounded-full shadow-xl hover:bg-green-600 transition-all active:scale-95"
      >
        Play Again
      </button>
    </div>
  );
}

function MemoryGame() {
  const icons = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉'];
  const [cards, setCards] = useState<{ id: number, icon: string, flipped: boolean, matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleFlip = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;
    
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isWon = cards.length > 0 && cards.every(c => c.matched);

  return (
    <div className="flex flex-col items-center gap-8 md:gap-10 max-w-full">
      <div className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
        {isWon ? "You Won!" : `Moves: ${moves}`}
      </div>
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={cn(
              "w-20 h-20 md:w-32 md:h-32 rounded-3xl text-4xl md:text-5xl flex items-center justify-center transition-all duration-300 transform shadow-lg active:scale-95",
              card.flipped || card.matched ? "bg-white" : "bg-indigo-500"
            )}
          >
            {(card.flipped || card.matched) ? card.icon : ""}
          </button>
        ))}
      </div>
      <button 
        onClick={initGame}
        className="px-10 py-5 md:px-12 md:py-6 bg-indigo-500 text-white text-2xl md:text-3xl font-bold rounded-full shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
      >
        Reset Game
      </button>
    </div>
  );
}

function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameBoardSize = 20;

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };
        
        // Wall collision
        if (head.x < 0 || head.x >= gameBoardSize || head.y < 0 || head.y >= gameBoardSize) {
          setIsGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some(segment => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        
        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood({
            x: Math.floor(Math.random() * gameBoardSize),
            y: Math.floor(Math.random() * gameBoardSize)
          });
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, 200);

    return () => clearInterval(moveSnake);
  }, [direction, food, isGameOver]);

  const reset = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 max-w-full">
      <div className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
        {isGameOver ? "Game Over!" : `Score: ${score}`}
      </div>
      
      <div 
        className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: 'min(80vw, 400px)', height: 'min(80vw, 400px)' }}
      >
        {snake.map((segment, i) => (
          <div 
            key={i}
            className="absolute bg-green-500 rounded-sm border border-gray-900"
            style={{ 
              width: '5%', height: '5%', 
              left: `${segment.x * 5}%`, top: `${segment.y * 5}%` 
            }}
          />
        ))}
        <div 
          className="absolute bg-red-500 rounded-full"
          style={{ 
            width: '5%', height: '5%', 
            left: `${food.x * 5}%`, top: `${food.y * 5}%` 
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div />
        <button onClick={() => setDirection({ x: 0, y: -1 })} className="p-6 bg-gray-200 rounded-2xl active:scale-90 transition-all"><Play className="-rotate-90" /></button>
        <div />
        <button onClick={() => setDirection({ x: -1, y: 0 })} className="p-6 bg-gray-200 rounded-2xl active:scale-90 transition-all"><Play className="rotate-180" /></button>
        <button onClick={() => setDirection({ x: 0, y: 1 })} className="p-6 bg-gray-200 rounded-2xl active:scale-90 transition-all"><Play className="rotate-90" /></button>
        <button onClick={() => setDirection({ x: 1, y: 0 })} className="p-6 bg-gray-200 rounded-2xl active:scale-90 transition-all"><Play /></button>
      </div>

      {isGameOver && (
        <button 
          onClick={reset}
          className="px-10 py-5 bg-green-500 text-white text-2xl font-bold rounded-full shadow-xl active:scale-95"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

function SudokuGame() {
  // Simple 4x4 Sudoku for elderly users
  const initialGrid = [
    [1, null, null, 2],
    [null, 2, 1, null],
    [null, 1, 2, null],
    [2, null, null, 1]
  ];
  const solution = [
    [1, 3, 4, 2],
    [4, 2, 1, 3],
    [3, 1, 2, 4],
    [2, 4, 3, 1]
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const handleCellClick = (r: number, c: number) => {
    if (initialGrid[r][c] !== null) return;
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
    setSelectedCell(null);
  };

  const isWon = grid.every((row, r) => row.every((val, c) => val === solution[r][c]));

  return (
    <div className="flex flex-col items-center gap-8 md:gap-10 max-w-full">
      <div className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
        {isWon ? "Sudoku Solved!" : "Fill the Numbers"}
      </div>
      
      <div className="grid grid-cols-4 gap-1 bg-gray-300 p-1 rounded-xl shadow-lg">
        {grid.map((row, r) => row.map((val, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => handleCellClick(r, c)}
            className={cn(
              "w-16 h-16 md:w-24 md:h-24 flex items-center justify-center text-3xl md:text-4xl font-bold transition-all",
              initialGrid[r][c] !== null ? "bg-gray-100 text-gray-500" : 
              selectedCell?.[0] === r && selectedCell?.[1] === c ? "bg-blue-100 text-blue-600" : "bg-white text-gray-900"
            )}
          >
            {val}
          </button>
        )))}
      </div>

      <div className="flex gap-4">
        {[1, 2, 3, 4].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500 text-white text-3xl font-bold rounded-2xl shadow-md active:scale-90"
          >
            {num}
          </button>
        ))}
      </div>

      <button 
        onClick={() => setGrid(initialGrid)}
        className="px-10 py-5 bg-gray-200 text-gray-700 text-2xl font-bold rounded-full active:scale-95"
      >
        Reset
      </button>
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          {icon}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')}
            className="p-3 bg-white border-2 border-gray-100 rounded-full text-gray-400 hover:text-green-500 hover:border-green-100 transition-all shadow-sm active:scale-90"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 bg-white border-2 border-gray-100 rounded-full text-gray-400 hover:text-green-500 hover:border-green-100 transition-all shadow-sm active:scale-90"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x snap-mandatory"
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(game)}
            className="flex-shrink-0 w-64 md:w-72 bg-white rounded-[32px] p-6 shadow-lg cursor-pointer snap-start flex flex-col items-center gap-4 border-2 border-transparent hover:border-green-100 transition-all"
          >
            <div className={cn("w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg", game.color)}>
              {game.icon}
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">{game.title}</h3>
              <p className="text-lg text-gray-500 mt-1 line-clamp-1">{game.description}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onSelect(game); }}
              className={cn("w-full py-3 rounded-2xl text-white text-xl font-bold shadow-md", game.color)}
            >
              Play
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
