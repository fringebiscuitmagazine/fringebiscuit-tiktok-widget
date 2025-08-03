import cheerio from 'cheerio';

/**
 * Vercel serverless function that scrapes the latest TikTok videos from a
 * public profile.  TikTok does not provide an official public API for
 * fetching a user’s feed, so this endpoint fetches the profile page,
 * parses the embedded state and returns the most recent video IDs.
 *
 * If you deploy this function to Vercel, requests to `/api/tiktoks` will
 * return JSON in the form `{ videos: [{ id: string, url: string }] }`.
 */
export default async function handler(req, res) {
  const username = req.query.user || 'fringebiscuit';
  const maxCount = parseInt(req.query.count || '5', 10);
  const url = `https://www.tiktok.com/@${username}`;

  try {
    // Fetch the user profile HTML.  Setting a User‑Agent header helps
    // avoid being blocked by TikTok’s bot protections.
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const html = await response.text();

    // Load the HTML into cheerio and extract the SIGI_STATE script
    // which contains a JSON blob with the user’s posts.
    const $ = cheerio.load(html);
    const stateScript = $('script[id="SIGI_STATE"]').html();
    const videos = [];

    if (stateScript) {
      const state = JSON.parse(stateScript);
      const itemList = state?.ItemList?.userPost?.list ?? [];
      const items = state?.ItemList?.userPost?.map ?? {};
      // Loop through the list of video IDs, slice to the desired count and
      // construct a URL for each video.
      for (const id of itemList.slice(0, maxCount)) {
        const item = items[id];
        if (item && item.id) {
          videos.push({
            id: item.id,
            url: `https://www.tiktok.com/@${username}/video/${item.id}`
          });
        }
      }
    }

    return res.status(200).json({ videos });
  } catch (err) {
    console.error('Error fetching TikTok videos:', err);
    return res.status(500).json({ error: 'Failed to fetch TikTok videos' });
  }
}
