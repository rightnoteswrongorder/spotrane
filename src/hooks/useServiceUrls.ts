import { useMemo } from 'react';
import { generateMusicServiceUrls } from '../utils/URLHelpers';

type ServiceUrls = {
  spotify?: string;
  discogs: string;
  wikipedia: string;
  ecm: string;
  allmusic: string;
};

/**
 * Hook to generate URLs for various music services based on album and artist information
 * 
 * @param albumName - The name of the album
 * @param artistName - The name of the artist
 * @param spotifyUri - Optional Spotify URI for the album
 * @returns An object containing properly formatted URLs for various music services
 */
export function useServiceUrls(
  albumName: string,
  artistName: string,
  spotifyUri?: string
): ServiceUrls {
  return useMemo(() => {
    const serviceUrls = generateMusicServiceUrls(albumName, artistName);

    return {
      ...serviceUrls,
      spotify: spotifyUri
    };
  }, [albumName, artistName, spotifyUri]);
}
