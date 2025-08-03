import { useEffect, useState } from 'react';

/**
 * TikTokCarousel component
 *
 * This React component fetches a list of the latest TikTok videos from a
 * serverless API endpoint and displays them in a responsive carousel.  It
 * loads TikTok’s embed script on mount so that each <blockquote> is
 * automatically transformed into an interactive video player.  The
 * carousel uses simple horizontal scrolling with CSS scroll snapping.  If
 * you are using Tailwind CSS, the classes provided will give you a neat
 * appearance; otherwise you can adapt the styles as you see fit.
 *
 * Props:
 *  - apiUrl (string): path to the JSON feed (defaults to `/api/tiktoks`)
 *  - maxVideos (number): maximum number of videos to show
 */
export default function TikTokCarousel({ apiUrl = '/api/tiktoks', maxVideos = 5 }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the latest TikTok video URLs from the API on component mount.
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch(`${apiUrl}?count=${maxVideos}`);
        const data = await res.json();
        setVideos(Array.isArray(data.videos) ? data.videos : []);
      } catch (error) {
        console.error('Error fetching TikTok videos', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [apiUrl, maxVideos]);

  // Load TikTok’s embed script whenever the list of videos changes.  The
  // script will automatically convert blockquote placeholders into embeds.
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [videos]);

  if (loading) {
    return <div>Loading TikTok videos…</div>;
  }

  if (!videos.length) {
    return <div>No TikTok videos found.</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
          {videos.map((video) => (
            <div
              key={video.id}
              className="snap-center shrink-0 w-full"
              style={{ minWidth: '100%' }}
            >
              <blockquote
                className="tiktok-embed"
                cite={video.url}
                data-video-id={video.id}
                style={{ width: '100%', minHeight: '600px' }}
              ></blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
