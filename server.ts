import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import yts from "yt-search";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  app.get("/api/youtube/test", async (req, res) => {
    try {
      const searchFn = (yts as any).default || yts;
      const r = await searchFn("bollywood");
      res.json({ success: true, count: r.videos.length });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.get("/api/youtube/search", async (req, res) => {
    const query = req.query.q as string;
    console.log(`[YouTube Search] Received query: "${query}"`);
    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    try {
      // Handle potential ESM/CJS default export issues
      const searchFn = (yts as any).default || yts;
      const r = await searchFn(query);
      const videos = r.videos.slice(0, 10).map((v: any) => ({
        id: v.videoId,
        title: v.title,
        thumbnail: v.thumbnail,
        category: "Search Result"
      }));
      console.log(`[YouTube Search] Found ${videos.length} videos`);
      res.json(videos);
    } catch (error) {
      console.error("YouTube search error:", error);
      res.status(500).json({ error: "Failed to search YouTube" });
    }
  });

  app.get("/api/youtube/category", async (req, res) => {
    const category = req.query.cat as string;
    console.log(`[YouTube Category] Received category: "${category}"`);
    if (!category) {
      return res.status(400).json({ error: "Missing category" });
    }

    const queryMap: Record<string, string> = {
      "Old Bollywood Songs": "old bollywood songs 60s 70s hits",
      "Bhajans": "popular hindi bhajans devotional songs",
      "Punjabi Songs": "classic punjabi folk songs old hits"
    };

    const query = queryMap[category] || category;

    try {
      const searchFn = (yts as any).default || yts;
      const r = await searchFn(query);
      const videos = r.videos.slice(0, 6).map((v: any) => ({
        id: v.videoId,
        title: v.title,
        thumbnail: v.thumbnail,
        category: category
      }));
      console.log(`[YouTube Category] Found ${videos.length} videos for "${category}"`);
      res.json(videos);
    } catch (error) {
      console.error("YouTube category error:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
