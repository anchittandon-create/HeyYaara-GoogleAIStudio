import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {componentTagger} from 'lovable-tagger';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  // Capture GEMINI_API_KEY from shell environment or .env file
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
  
  console.log(`[Vite Config] GEMINI_API_KEY is ${GEMINI_API_KEY ? 'SET' : 'NOT SET'}`);

  return {
    plugins: [
      react(), 
      tailwindcss(),
      mode === 'development' && componentTagger()
    ].filter(Boolean),
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(GEMINI_API_KEY),
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
