import { YouTubeVideo } from '../types';

// Fallback curated list if API fails
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
  try {
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Local API request failed');
    return await response.json();
  } catch (error) {
    console.error("Error searching YouTube via local API:", error);
    return [];
  }
}

export async function getCategoryVideos(category: string): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(`/api/youtube/category?cat=${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error('Local API request failed');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category ${category} via local API:`, error);
    return FALLBACK_VIDEOS[category] || [];
  }
}
