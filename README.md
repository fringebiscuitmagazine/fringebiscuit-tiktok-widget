# Fringebiscuit TikTok Carousel Widget

This repository contains everything you need to deploy and embed an auto‑updating TikTok carousel for **Fringebiscuit**, the theatre review blog.  It consists of a lightweight scraper that fetches the latest public videos from your TikTok profile, a serverless API endpoint for Vercel, and a React component that displays those videos in a responsive carousel.

> **Note**: TikTok does not offer a free, public API for fetching posts.  This solution relies on scraping your public profile page.  For personal and small‑scale use it works well, but respect TikTok’s terms of service and avoid heavy usage.

## Contents

```
.
├── api
│   └── tiktoks.js      # Vercel serverless function to fetch latest videos
├── components
│   └── TikTokCarousel.jsx  # React component that fetches from the API and displays a carousel
├── package.json        # Declares `cheerio` dependency (used in the API)
└── README.md           # This file
```

## How it works

1. **Backend (API)** – When `/api/tiktoks` is requested on your deployment, the function defined in `api/tiktoks.js` runs.  It fetches the HTML of your TikTok profile page, reads an embedded JSON blob (`SIGI_STATE`), extracts the most recent video IDs and returns a JSON response such as:

   ```json
   {
     "videos": [
       { "id": "7287801953413233963", "url": "https://www.tiktok.com/@fringebiscuit/video/7287801953413233963" },
       { "id": "7283519995893830913", "url": "https://www.tiktok.com/@fringebiscuit/video/7283519995893830913" },
       …
     ]
   }
   ```

2. **Frontend (React component)** – `components/TikTokCarousel.jsx` is a ready‑to‑use React component.  On mount it fetches the JSON feed from `/api/tiktoks`, then loads TikTok’s embed script and renders each video inside a horizontally scrollable carousel with scroll‑snap.  You can import this component into your Next.js/React app.

3. **Deployment** – Deploy the project to Vercel with a single click.  Vercel will host the serverless function and serve your React files.  You can then embed the widget on any website via iframe or by integrating the React component directly.

## Quick Start (no coding required)

If you just want the embed and don’t wish to edit any code, follow these steps:

1. **Create a Git repository** – either on GitHub or locally.  Copy the contents of this folder into the repository.

2. **Deploy to Vercel**:
   - Sign up for a free Vercel account if you don’t have one.
   - Click the **“New Project”** button on the Vercel dashboard and import your repository.
   - Accept the defaults (no build step is necessary since the API is serverless) and deploy.  Vercel will assign your project a unique URL like `https://fringebiscuit-tiktok.vercel.app`.

3. **Test the API** – navigate to `https://<your‑project>.vercel.app/api/tiktoks`.  You should see a JSON array of video objects.  If nothing appears, make sure your TikTok profile is public and has at least one video.

4. **Embed the carousel** – Create a new page in your existing site and use the following iframe to embed the widget:

   ```html
   <iframe
     src="https://<your‑project>.vercel.app/embed.html"
     style="width:100%; max-width:600px; border:none; overflow:hidden;"
     height="650"
     scrolling="no"
     title="Fringebiscuit TikTok carousel">
   </iframe>
   ```

   The file `embed.html` isn’t included here yet; you can either build one yourself using the React component or ask ChatGPT to generate one in plain HTML.  Alternatively, integrate the React component directly into your React‑based site.

## Embedding in a React website

If your site already uses React or Next.js, you can import the `TikTokCarousel` component:

```jsx
import TikTokCarousel from './components/TikTokCarousel';

export default function Home() {
  return (
    <div>
      <h1>Latest TikToks</h1>
      <TikTokCarousel apiUrl="/api/tiktoks" maxVideos={5} />
    </div>
  );
}
```

Tailwind CSS classes are used for layout and responsiveness.  If you don’t use Tailwind you can adapt the CSS to your preferred framework.

## Customising

- **Change the TikTok user** – Add a `?user=someusername` query parameter to the API URL to fetch another profile.  Example: `/api/tiktoks?user=theatrelover&count=3`.
- **Number of videos** – Adjust the `count` query parameter (or `maxVideos` prop) to change how many videos are fetched.
- **Styling** – Modify the component’s markup and classes.  You can also replace the simple scroll‑snap carousel with a library like `react‑slick` if you prefer advanced controls.

## Limitations & Caveats

- **Scraping reliability** – TikTok may change its page structure without warning, which could break the scraper.  If the API stops returning results, the parsing logic in `api/tiktoks.js` will need to be updated.
- **Rate limits** – Avoid calling the API too frequently.  The current implementation makes a single request on page load; that’s appropriate for a widget.
- **Privacy** – Only public videos can be scraped.  Private or friends‑only posts will not appear.

## Next Steps

This project lays the groundwork for an auto‑updating TikTok feed.  Here are some ideas for future enhancements:

1. **Caching** – Cache the results in Vercel’s Edge Config or KV store to minimise repeated scraping.
2. **CMS integration** – Allow manual override or addition of specific videos via a CMS or Google Sheet.
3. **Advanced carousel** – Incorporate autoplay, thumbnails or a more polished slider library.
4. **Analytics** – Track click‑through rates or viewer interactions to better understand engagement.

Feel free to adapt and extend this to suit Fringebiscuit’s needs.  If you encounter issues deploying or integrating the widget, please reach out for support.
