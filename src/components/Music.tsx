import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Play, X, Music as MusicIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { YouTubeVideo, AppState } from '../types';
import { searchVideos, getCategoryVideos } from '../services/youtubeService';
import { useQuery } from '@tanstack/react-query';

const CATEGORIES = ["Old Bollywood Songs", "Bhajans", "Punjabi Songs"];

export default function Music({ initialQuery, onNavigate }: { initialQuery?: string, onNavigate?: (state: AppState) => void }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery || "");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  // Update search if initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setDebouncedSearch(initialQuery);
    }
  }, [initialQuery]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search Results Query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchVideos(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  return (
    <div className="flex flex-col h-full bg-[#FFF9F5] overflow-hidden">
      {/* Header & Search */}
      <div className="p-4 md:p-6 bg-white shadow-sm sticky top-0 z-20 space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate?.('HOME')}
            className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-90"
          >
            <ChevronLeft className="w-8 h-8 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-md">
              <MusicIcon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Music</h1>
          </div>
        </div>

        <div className="relative max-w-4xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search songs (Hindi, Punjabi...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-10 py-5 text-2xl rounded-2xl border-2 border-orange-50 focus:border-orange-500 outline-none transition-all shadow-sm bg-orange-50/30 placeholder:text-gray-400"
          />
          {isSearching && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 md:p-8 space-y-12 overflow-y-auto scrollbar-hide pb-12">
        {debouncedSearch.length > 2 ? (
          <section className="space-y-10">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-5xl font-bold text-gray-900">Search Results</h2>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-3xl font-bold text-orange-600 hover:text-orange-700 p-4"
              >
                Clear
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-4">
              {searchResults?.map((video) => (
                <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
              ))}
              {searchResults?.length === 0 && !isSearching && (
                <div className="col-span-full py-20 text-center space-y-6">
                  <p className="text-4xl text-gray-400 font-medium italic">"Koi gaana nahi mila..."</p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="px-12 py-6 bg-orange-500 text-white text-3xl font-bold rounded-full shadow-xl"
                  >
                    Go Back
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {CATEGORIES.map((cat) => (
              <CategorySection 
                key={cat} 
                category={cat} 
                onVideoSelect={setSelectedVideo} 
              />
            ))}
          </>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            <div className="relative w-full max-w-7xl aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-8 right-8 z-10 p-6 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110 active:scale-95"
              >
                <X className="w-12 h-12" />
              </button>
              
              <iframe 
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
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

function CategorySection({ category, onVideoSelect }: { category: string, onVideoSelect: (v: YouTubeVideo) => void, key?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: videos, isLoading } = useQuery({
    queryKey: ['category', category],
    queryFn: () => getCategoryVideos(category),
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (isLoading) return (
    <div className="h-80 flex items-center justify-center">
      <Loader2 className="w-16 h-16 text-orange-200 animate-spin" />
    </div>
  );

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-5xl font-bold text-gray-900 tracking-tight">{category}</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="p-4 bg-white border-2 border-orange-100 rounded-full text-orange-500 hover:bg-orange-50 transition-colors shadow-sm active:scale-90"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-4 bg-white border-2 border-orange-100 rounded-full text-orange-500 hover:bg-orange-50 transition-colors shadow-sm active:scale-90"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-10 overflow-x-auto pb-10 px-4 scrollbar-hide snap-x snap-mandatory"
      >
        {videos?.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onClick={() => onVideoSelect(video)} 
            className="flex-shrink-0 w-[400px] md:w-[450px] snap-start"
          />
        ))}
      </div>
    </section>
  );
}

function VideoCard({ video, onClick, className }: { video: YouTubeVideo, onClick: () => void, className?: string, key?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "bg-white rounded-[32px] overflow-hidden shadow-xl cursor-pointer transition-all border-2 border-transparent hover:border-orange-200",
        className
      )}
    >
      <div className="relative aspect-video group">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
            <Play className="w-12 h-12 text-orange-600 fill-current ml-1.5" />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 text-white text-xl font-bold rounded-xl backdrop-blur-sm">
          Listen Now
        </div>
      </div>
      <div className="p-8 space-y-3">
        <h3 className="text-3xl font-bold text-gray-900 line-clamp-2 leading-tight h-[4.5rem]">
          {video.title}
        </h3>
        <p className="text-2xl text-orange-600 font-semibold tracking-wide uppercase">
          {video.category}
        </p>
      </div>
    </motion.div>
  );
}
