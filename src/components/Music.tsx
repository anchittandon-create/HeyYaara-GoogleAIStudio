import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Play, X, Music as MusicIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
}

const CATEGORIES = [
  { name: "Old Bollywood", query: "old bollywood songs 60s 70s" },
  { name: "Bhajans", query: "popular bhajans hindi" },
  { name: "Punjabi Classics", query: "old punjabi folk songs" },
];

const MOCK_VIDEOS: Video[] = [
  { id: "T94PHkuydcw", title: "Lata Mangeshkar Hits - Lag Jaa Gale", thumbnail: "https://img.youtube.com/vi/T94PHkuydcw/0.jpg", category: "Old Bollywood" },
  { id: "hT_nvWreIhg", title: "Kishore Kumar Classics - Pal Pal Dil Ke Paas", thumbnail: "https://img.youtube.com/vi/hT_nvWreIhg/0.jpg", category: "Old Bollywood" },
  { id: "S-Xm76n_m_w", title: "Hanuman Chalisa - Gulshan Kumar", thumbnail: "https://img.youtube.com/vi/S-Xm76n_m_w/0.jpg", category: "Bhajans" },
  { id: "v_v_u8V_u8", title: "Gurdas Maan Folk - Challa", thumbnail: "https://img.youtube.com/vi/v_v_u8V_u8/0.jpg", category: "Punjabi Classics" },
  { id: "6L6Xq6Oj_88", title: "Mohammed Rafi Hits - Kya Hua Tera Wada", thumbnail: "https://img.youtube.com/vi/6L6Xq6Oj_88/0.jpg", category: "Old Bollywood" },
  { id: "m77H_S_S_S_w", title: "Gayatri Mantra - 108 Times", thumbnail: "https://img.youtube.com/vi/m77H_S_S_S_w/0.jpg", category: "Bhajans" },
];

export default function Music() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="flex flex-col h-full bg-pink-50 overflow-y-auto">
      {/* Header & Search */}
      <div className="p-8 md:p-12 bg-white shadow-sm space-y-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-pink-500 rounded-2xl text-white">
            <MusicIcon className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">Music</h1>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-400" />
          <input 
            type="text"
            placeholder="Gaana search karein..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-20 pr-8 py-8 text-3xl rounded-3xl border-4 border-pink-100 focus:border-pink-500 outline-none transition-all shadow-lg"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 p-8 md:p-12 space-y-16">
        {CATEGORIES.map((cat) => (
          <section key={cat.name} className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-4xl font-bold text-gray-800">{cat.name}</h2>
              <button className="text-2xl font-semibold text-pink-600 hover:underline">View All</button>
            </div>
            
            <div className="flex gap-8 overflow-x-auto pb-8 px-4 scrollbar-hide snap-x">
              {MOCK_VIDEOS.filter(v => v.category === cat.name).map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedVideo(video)}
                  className="flex-shrink-0 w-80 md:w-96 bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer snap-start"
                >
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-10 h-10 text-pink-600 fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">{video.title}</h3>
                    <p className="text-xl text-gray-500 mt-2">{video.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-12"
          >
            <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-10 p-4 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
              >
                <X className="w-10 h-10" />
              </button>
              
              <iframe 
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
