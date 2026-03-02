// Dynamic app URL: prefer the runtime origin (web) and fall back to a placeholder.
// This lets the app automatically use the current site URL when served on Netlify/Vercel/etc.
const CONFIG = {
  get appUrl() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        return window.location.origin;
      }
    } catch (e) {
      // ignore
    }
    // Fallback — update if you want a different default for native/test environments
    return 'https://your-site-name.netlify.app';
  }
};

export default CONFIG;
