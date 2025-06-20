/**
 * Clean text by removing content within parentheses
 * @param text - The text to clean
 * @returns The cleaned text without parenthetical content
 */
export function removeParentheses(text: string): string {
  return text.replace(/ *\([^)]*\) */g, "");
}

/**
 * Create a properly encoded search URL
 * @param baseUrl - The base URL
 * @param params - Object containing query parameters
 * @returns A properly formatted and encoded URL
 */
export function createSearchUrl(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

/**
 * Generate properly formatted and encoded external service URLs for an album
 * 
 * @param albumName - The name of the album
 * @param artistName - The name of the artist
 * @returns Object containing URLs for various music services
 */
export function generateMusicServiceUrls(
  albumName: string, 
  artistName: string
): Record<string, string> {
  const cleanAlbumName = removeParentheses(albumName);

  return {
    discogs: createSearchUrl('https://www.discogs.com/search/', {
      q: cleanAlbumName,
      type: 'master',
      format: 'album'
    }),

    wikipedia: createSearchUrl('https://en.wikipedia.org/w/index.php', {
      search: `${cleanAlbumName} ${artistName}`
    }),

    allmusic: createSearchUrl('https://www.allmusic.com/search/all/', {
      query: `${cleanAlbumName} ${artistName}`
    }),

    ecm: createSearchUrl('https://ecmreviews.com/', {
      s: cleanAlbumName
    })
  };
}
