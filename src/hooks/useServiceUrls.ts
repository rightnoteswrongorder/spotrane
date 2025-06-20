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
 * @throws Error if required inputs are empty
 */
export function useServiceUrls(
  albumName: string,
  artistName: string,
  spotifyUri?: string
): ServiceUrls {
  return useMemo(() => {
    if (!albumName.trim() || !artistName.trim()) {
      throw new Error('Album name and artist name are required');
    }

    const serviceUrls = generateMusicServiceUrls(albumName, artistName);
    const urls: ServiceUrls = {
      discogs: serviceUrls.discogs,
      wikipedia: serviceUrls.wikipedia,
      ecm: serviceUrls.ecm,
      allmusic: serviceUrls.allmusic,
      spotify: spotifyUri
    };

    return urls;
  }, [albumName, artistName, spotifyUri]);
}