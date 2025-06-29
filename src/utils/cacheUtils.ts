/**
 * Utility functions for managing application cache
 */

/**
 * Clear all application caches including:
 * - LocalStorage
 * - SessionStorage
 * - Application Cache (if available)
 * - Service Worker Cache (if available)
 * 
 * @returns {Promise<boolean>} True if cache was cleared successfully
 */
export const clearAppCache = async (): Promise<boolean> => {
  try {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear application cache if available
    if ('caches' in window) {
      const cacheNames = await window.caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => window.caches.delete(cacheName))
      );
    }
    
    // Unregister service workers if available
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    }
    
    console.log('Application cache cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing application cache:', error);
    return false;
  }
};

/**
 * Clear specific cache items by key pattern
 * 
 * @param {string} keyPattern - Regular expression pattern to match cache keys
 * @returns {boolean} True if matching cache items were cleared
 */
export const clearCacheByPattern = (keyPattern: string): boolean => {
  try {
    const pattern = new RegExp(keyPattern);
    
    // Clear matching localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && pattern.test(key)) {
        localStorage.removeItem(key);
      }
    }
    
    // Clear matching sessionStorage items
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && pattern.test(key)) {
        sessionStorage.removeItem(key);
      }
    }
    
    console.log(`Cache items matching pattern "${keyPattern}" cleared`);
    return true;
  } catch (error) {
    console.error(`Error clearing cache by pattern "${keyPattern}":`, error);
    return false;
  }
};

/**
 * Reload the application after clearing cache
 */
export const clearCacheAndReload = async (): Promise<void> => {
  const success = await clearAppCache();
  if (success) {
    // Force reload from server, not from cache
    window.location.reload(true);
  }
};