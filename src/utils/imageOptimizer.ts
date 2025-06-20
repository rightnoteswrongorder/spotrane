/**
 * Constructs an optimized image URL with appropriate dimensions
 * 
 * @param url - Original image URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL or fallback
 */
export function getOptimizedImageUrl(
  url: string | undefined,
  width: number = 80, 
  height: number = 80
): string {
  // If URL is undefined or empty, return a placeholder
  if (!url) {
    return `/static/images/placeholder-album.svg`;
  }

  // Check if it's a Spotify image that supports resizing parameters
  if (url.includes('i.scdn.co/image')) {
    // Add width parameter to Spotify images
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&height=${height}`;
  }

  // For other URLs, return as is
  return url;
}

/**
 * Preloads an image to improve perceived performance
 * 
 * @param src - Image source URL
 * @returns A promise that resolves when the image is loaded
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch preloads multiple images
 * 
 * @param srcs - Array of image source URLs
 * @returns A promise that resolves when all images are loaded
 */
export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map(preloadImage));
}
