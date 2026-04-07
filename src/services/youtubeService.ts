import { YouTubeVideo } from '../types';

const API_KEY = (import.meta as any).env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Fallback curated list if API fails or key is missing
const FALLBACK_VIDEOS: Record<string, YouTubeVideo[]> = {
  "Old Bollywood Songs": [
    { id: "T94PHkuydcw", title: "Lata Mangeshkar Hits - Lag Jaa Gale", thumbnail: "https://img.youtube.com/vi/T94PHkuydcw/0.jpg", category: "Old Bollywood Songs" },
    { id: "hT_nvWreIhg", title: "Kishore Kumar Classics - Pal Pal Dil Ke Paas", thumbnail: "https://img.youtube.com/vi/hT_nvWreIhg/0.jpg", category: "Old Bollywood Songs" },
    { id: "6L6Xq6Oj_88", title: "Mohammed Rafi Hits - Kya Hua Tera Wada", thumbnail: "https://img.youtube.com/vi/6L6Xq6Oj_88/0.jpg", category: "Old Bollywood Songs" },
  ],
  "Bhajans": [
    { id: "S-Xm76n_m_w", title: "Hanuman Chalisa - Gulshan Kumar", thumbnail: "https://img.youtube.com/vi/S-Xm76n_m_w/0.jpg", category: "Bhajans" },
    { id: "m77H_S_S_S_w", title: "Gayatri Mantra - 108 Times", thumbnail: "https://img.youtube.com/vi/m77H_S_S_S_w/0.jpg", category: "Bhajans" },
    { id: "v_v_u8V_u8", title: "Shri Krishna Bhajans", thumbnail: "https://img.youtube.com/vi/v_v_u8V_u8/0.jpg", category: "Bhajans" },
  ],
  "Punjabi Songs": [
    { id: "v_v_u8V_u8", title: "Gurdas Maan Folk - Challa", thumbnail: "https://img.youtube.com/vi/v_v_u8V_u8/0.jpg", category: "Punjabi Songs" },
    { id: "6L6Xq6Oj_88", title: "Classic Punjabi Hits", thumbnail: "https://img.youtube.com/vi/6L6Xq6Oj_88/0.jpg", category: "Punjabi Songs" },
  ]
};

export async function searchVideos(query: string): Promise<YouTubeVideo[]> {
  if (!API_KEY) {
    console.warn("YouTube API Key missing. Using fallback results.");
    return FALLBACK_VIDEOS["Old Bollywood Songs"]; // Just a sample
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('YouTube API request failed');
    
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      category: "Search Result"
    }));
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return [];
  }
}

export async function getCategoryVideos(category: string): Promise<YouTubeVideo[]> {
  const queryMap: Record<string, string> = {
    "Old Bollywood Songs": "old bollywood songs 60s 70s hits",
    "Bhajans": "popular hindi bhajans devotional songs",
    "Punjabi Songs": "classic punjabi folk songs old hits"
  };

  const query = queryMap[category] || category;
  
  if (!API_KEY) {
    return FALLBACK_VIDEOS[category] || [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
    );
    
    if (!response.ok) throw new Error('YouTube API request failed');
    
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      category: category
    }));
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    return FALLBACK_VIDEOS[category] || [];
  }
}
