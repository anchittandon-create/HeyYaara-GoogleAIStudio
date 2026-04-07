import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneOff, MessageSquare, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage, FunctionDeclaration, Type } from "@google/genai";
import VoiceOrb from './VoiceOrb';
import { VoiceState, Message, AppState } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface TalkProps {
  onEnd: () => void;
  onNavigate: (state: AppState, extra?: any) => void;
}

export default function Talk({ onEnd, onNavigate }: TalkProps) {
  const [state, setState] = useState<VoiceState>('INITIALIZING');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  // Initialize Gemini Live Session
  useEffect(() => {
    const initSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const session = await ai.live.connect({
          model: "gemini-3.1-flash-live-preview",
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
            },
            tools: [
              { googleSearch: {} },
              {
                functionDeclarations: [
                  {
                    name: "navigateTo",
                    description: "Navigate to a specific page in the app.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        page: {
                          type: Type.STRING,
                          enum: ["HOME", "MUSIC", "GAMES", "TALK"],
                          description: "The page to navigate to."
                        }
                      },
                      required: ["page"]
                    }
                  },
                  {
                    name: "playMusic",
                    description: "Search and play a specific song or category of music.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        query: {
                          type: Type.STRING,
                          description: "The song name, artist, or category (e.g., 'Bhajans', 'Old Bollywood')."
                        }
                      },
                      required: ["query"]
                    }
                  },
                  {
                    name: "openGame",
                    description: "Open a specific game.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        gameId: {
                          type: Type.STRING,
                          enum: ["ludo", "snakes", "carrom", "hockey", "ttt", "bubble", "memory", "quiz"],
                          description: "The ID of the game to open."
                        }
                      },
                      required: ["gameId"]
                    }
                  }
                ]
              }
            ],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: "You are Yaara, a warm, wise, and friendly AI companion for elderly users. Speak slowly, clearly, and with empathy in a mix of Hindi, English, and Punjabi (Hinglish). Keep responses concise (1-2 sentences) but meaningful. Be supportive, patient, and engaging. Never repeat what the user said. If there is silence, provide a gentle prompt or reassurance. \n\nCRITICAL CAPABILITIES:\n1. Use 'googleSearch' for ANY factual questions (news, weather, health tips).\n2. Use 'navigateTo' if the user wants to go to a different section (e.g., 'Home le chalo', 'Music dikhao').\n3. Use 'playMusic' if the user wants to listen to something (e.g., 'Bhajan chalao', 'Kishore Kumar ke gaane').\n4. Use 'openGame' if the user wants to play a game (e.g., 'Ludo khelna hai', 'Koi game kholo').\n\nYour goal is to be a reliable source of truth, a comforting presence, and a helpful guide through the app.",
          },
          callbacks: {
            onopen: () => {
              console.log("Live session opened");
              setState('LISTENING');
              startAudioCapture();
              
              // AI speaks first
              if (sessionRef.current) {
                sessionRef.current.sendRealtimeInput({
                  text: "Namaste! Main Yaara hoon. Aap kaise hain aaj?"
                });
              }
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle audio output
              const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio) {
                queueAudio(base64Audio);
              }

              // Handle transcription
              const modelTranscript = message.serverContent?.modelTurn?.parts?.[0]?.text;
              if (modelTranscript) {
                addMessage(modelTranscript, 'YAARA');
              }

              // Handle tool calls
              const toolCalls = message.serverContent?.modelTurn?.parts?.filter(p => p.functionCall);
              if (toolCalls && toolCalls.length > 0) {
                for (const part of toolCalls) {
                  const call = part.functionCall!;
                  console.log("Tool call:", call);
                  
                  if (call.name === 'navigateTo') {
                    onNavigate(call.args.page as any);
                  } else if (call.name === 'playMusic') {
                    onNavigate('MUSIC', { query: call.args.query });
                  } else if (call.name === 'openGame') {
                    onNavigate('GAMES', { gameId: call.args.gameId });
                  }
                }
              }

              const userTranscript = (message.serverContent as any)?.userTurn?.parts?.[0]?.text;
              if (userTranscript) {
                addMessage(userTranscript, 'USER');
              }

              // Handle interruption
              if (message.serverContent?.interrupted) {
                stopPlayback();
                setState('LISTENING');
              }
            },
            onerror: (error) => {
              console.error("Live session error:", error);
              setState('IDLE');
            },
            onclose: () => {
              console.log("Live session closed");
              setState('IDLE');
            }
          }
        });

        sessionRef.current = session;
      } catch (error) {
        console.error("Failed to initialize Gemini Live:", error);
        setState('IDLE');
      }
    };

    initSession();

    return () => {
      stopAudioCapture();
      if (sessionRef.current) {
        sessionRef.current.close();
      }
    };
  }, []);

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted) return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Convert to 16-bit PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }

        // Send to Gemini
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        if (sessionRef.current) {
          sessionRef.current.sendRealtimeInput({
            audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
    } catch (error) {
      console.error("Failed to start audio capture:", error);
    }
  };

  const stopAudioCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const queueAudio = (base64Data: string) => {
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    audioQueueRef.current.push(floatData);
    if (!isPlayingRef.current) {
      playNextInQueue();
    }
  };

  const playNextInQueue = async () => {
    if (audioQueueRef.current.length === 0 || !isSpeakerOn) {
      isPlayingRef.current = false;
      setState('LISTENING');
      return;
    }

    isPlayingRef.current = true;
    setState('SPEAKING');

    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const floatData = audioQueueRef.current.shift()!;
    const buffer = audioContext.createBuffer(1, floatData.length, 16000);
    buffer.getChannelData(0).set(floatData);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.onended = () => {
      playNextInQueue();
    };
    source.start();
  };

  const stopPlayback = () => {
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    // Note: Stopping the current source would require keeping track of it
  };

  const addMessage = (text: string, sender: 'YAARA' | 'USER') => {
    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), text, sender, timestamp: Date.now() }
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-3xl font-bold">Yaara is here</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className={cn(
              "p-4 rounded-full transition-colors",
              showTranscript ? "bg-white/20" : "hover:bg-white/10"
            )}
          >
            <MessageSquare className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Voice Visualization */}
        <div className={cn(
          "flex-1 flex flex-col items-center justify-center p-8 transition-all duration-500",
          showTranscript ? "md:w-2/3" : "w-full"
        )}>
          <VoiceOrb 
            state={state} 
            className="w-80 h-80 md:w-96 md:h-96"
          />
          <div className="mt-12 text-center space-y-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={state}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-4xl font-medium text-white/80"
              >
                {state === 'LISTENING' ? "Main sun raha hoon..." : 
                 state === 'SPEAKING' ? "Yaara bol rahi hai..." : 
                 state === 'PROCESSING' ? "Ek minute..." : "Taiyaar ho raha hoon..."}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Transcript Panel */}
        <AnimatePresence>
          {showTranscript && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full md:w-1/3 bg-white/5 border-l border-white/10 flex flex-col"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white/60 uppercase tracking-widest">Transcript</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((m) => (
                  <div 
                    key={m.id}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      m.sender === 'USER' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-6 rounded-3xl text-2xl leading-relaxed",
                      m.sender === 'USER' ? "bg-blue-600 text-white" : "bg-white/10 text-white/90"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-white/20 text-2xl italic">
                    Baat shuru karein...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Footer */}
      <div className="p-8 md:p-12 flex items-center justify-center gap-8 md:gap-16 bg-black/40 backdrop-blur-xl">
        <ControlButton 
          icon={isMuted ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          label={isMuted ? "Unmute" : "Mute"}
          color={isMuted ? "bg-red-500" : "bg-white/10"}
          onClick={() => setIsMuted(!isMuted)}
        />
        
        <button 
          onClick={onEnd}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-600 flex items-center justify-center shadow-2xl hover:bg-red-700 transition-all hover:scale-110 active:scale-95"
        >
          <PhoneOff className="w-12 h-12 md:w-16 md:h-16 text-white" />
        </button>

        <ControlButton 
          icon={isSpeakerOn ? <Volume2 className="w-10 h-10" /> : <VolumeX className="w-10 h-10" />}
          label={isSpeakerOn ? "Speaker" : "Muted"}
          color={isSpeakerOn ? "bg-white/10" : "bg-red-500"}
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
        />
      </div>
    </div>
  );
}

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

function ControlButton({ icon, label, color, onClick }: ControlButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button 
        onClick={onClick}
        className={cn(
          "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95",
          color
        )}
      >
        {icon}
      </button>
      <span className="text-xl font-medium text-white/60">{label}</span>
    </div>
  );
}
