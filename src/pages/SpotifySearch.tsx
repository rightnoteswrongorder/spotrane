import {useEffect, useState} from 'react'
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import Grid from "@mui/material/Grid";
import {AlbumCard} from "./components/AlbumCard.tsx";
import {SpotraneAlbum} from "../interfaces/SpotraneAlbum.ts";
import {SpotifyApiProxy} from "../api/spotify.ts";
import {SupabaseApi} from "../api/supabase.ts";


export default function SpotifySearch({sdk, searchText}: { sdk: SpotifyApi | null, searchText: string }) {
    const [results, setResults] = useState<SpotraneAlbum[]>([]);

    const saveAlbum = async (album: SpotraneAlbum) => {
        SupabaseApi.saveAlbum(album)
        const newRes = results.map((albumInResults) => {
            if (albumInResults.id == album.id) {
                albumInResults.saved = true
            }
            return albumInResults
        })
        setResults(newRes)
    }

    useEffect(() => {
        onSubmit()
    }, []);

    const onSubmit = () => {
        (async () => {
            const searchResults = await SpotifyApiProxy.searchForAlbum(sdk, searchText)
            if (searchResults) {
                setResults(await Promise.all(searchResults.albums?.items.map(async (simplifiedAlbum) => {
                    const artist = await SpotifyApiProxy.getArtist(sdk, simplifiedAlbum.artists[0].id)
                    const album = await SpotifyApiProxy.getAlbum(sdk, simplifiedAlbum.id)
                    const isSaved = await SupabaseApi.isSaved(simplifiedAlbum.id)
                    return {
                        id: simplifiedAlbum.id,
                        name: simplifiedAlbum.name,
                        releaseDate: simplifiedAlbum.release_date,
                        label: album?.label,
                        imageUri: simplifiedAlbum.images[0].url,
                        albumUri: simplifiedAlbum.uri,
                        artistName: artist?.name,
                        artistGenres: artist?.genres,
                        artist: {name: artist?.name, id: artist?.id, genres: artist?.genres},
                        saved: isSaved
                    }
                })))

            }
        })();
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid xs={12} item={true}>
                    <Grid container justifyContent="center" spacing={4} marginTop={4} marginBottom={4}>
                        {results.map((album) => (
                            <Grid item={true} key={album.id}><AlbumCard album={album} saveAlbum={saveAlbum}
                            ></AlbumCard></Grid>
                        ))} </Grid>
                </Grid>
            </Grid>
        </>
    )
}
