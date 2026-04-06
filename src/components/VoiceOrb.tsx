import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { VoiceState } from '@/src/types';

interface VoiceOrbProps {
  state: VoiceState;
  className?: string;
  onClick?: () => void;
}

export default function VoiceOrb({ state, className, onClick }: VoiceOrbProps) {
  const isListening = state === 'LISTENING';
  const isSpeaking = state === 'SPEAKING';
  const isProcessing = state === 'PROCESSING';

  return (
    <div 
      className={cn("relative flex items-center justify-center cursor-pointer", className)}
      onClick={onClick}
    >
      {/* Outer glow */}
      <AnimatePresence>
        {(isListening || isSpeaking || isProcessing) && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className={cn(
              "absolute inset-0 rounded-full blur-3xl",
              isListening ? "bg-blue-400" : isSpeaking ? "bg-orange-400" : "bg-purple-400"
            )}
          />
        )}
      </AnimatePresence>

      {/* Main Orb */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.05, 1] : isSpeaking ? [1, 1.1, 1] : [1, 1.02, 1],
          boxShadow: isListening 
            ? "0 0 40px rgba(59, 130, 246, 0.5)" 
            : isSpeaking 
              ? "0 0 60px rgba(249, 115, 22, 0.6)" 
              : "0 0 20px rgba(0, 0, 0, 0.05)",
        }}
        transition={{
          duration: isSpeaking ? 0.5 : isListening ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={cn(
          "w-48 h-48 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500",
          isListening ? "bg-blue-500" : isSpeaking ? "bg-orange-500" : isProcessing ? "bg-purple-500" : "bg-gray-200"
        )}
      >
        {/* Waveform animation for listening */}
        {isListening && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [10, 40, 10] }}
                transition={{ 
                  duration: 0.6, 
                  repeat: Infinity, 
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                className="w-2 bg-white rounded-full"
              />
            ))}
          </div>
        )}

        {/* Pulse animation for speaking */}
        {isSpeaking && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-12 h-12 bg-white/30 rounded-full"
          />
        )}

        {/* Spinner for processing */}
        {isProcessing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
          />
        )}

        {/* Default icon or state text */}
        {!isListening && !isSpeaking && !isProcessing && (
          <div className="text-gray-400 font-bold text-xl">Yaara</div>
        )}
      </motion.div>
    </div>
  );
}
