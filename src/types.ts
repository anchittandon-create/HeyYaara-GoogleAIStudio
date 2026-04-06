export type AppState = 'HOME' | 'TALK' | 'MUSIC' | 'GAMES';

export type VoiceState = 'INITIALIZING' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'IDLE';

export interface Message {
  id: string;
  text: string;
  sender: 'YAARA' | 'USER';
  timestamp: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
}

export interface Game {
  id: string;
  title: string;
  icon: string;
  category: 'FUN' | 'BRAIN';
}
