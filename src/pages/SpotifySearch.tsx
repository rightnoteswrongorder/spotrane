import {useState} from 'react'
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import {
    Button,
    Stack,
    TextField
} from '@mui/material';
import {SubmitHandler, useForm} from 'react-hook-form';
import Grid from "@mui/material/Grid";
import {AlbumCard} from "./components/AlbumCard.tsx";
import {SpotraneAlbum} from "../interfaces/SpotraneAlbum.ts";
import {SpotifyApiProxy} from "../api/spotify.ts";

interface IFormInput {
    searchText: string
}

export default function SpotifySearch({sdk}: { sdk: SpotifyApi | null }) {
    const [results, setResults] = useState<SpotraneAlbum[]>([]);
    const {register, handleSubmit} = useForm<IFormInput>()

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        (async () => {
            const searchResults = await SpotifyApiProxy.searchForAlbum(sdk, data.searchText)
            if (searchResults) {
                setResults(await Promise.all(searchResults.albums?.items.map(async (simplifiedAlbum) => {
                    const artist = await SpotifyApiProxy.getArtist(sdk, simplifiedAlbum.artists[0].id)
                    const album = await SpotifyApiProxy.getAlbum(sdk, simplifiedAlbum.id)
                    return {
                        id: simplifiedAlbum.id,
                        name: simplifiedAlbum.name,
                        releaseDate: simplifiedAlbum.release_date,
                        label: album?.label,
                        imageUri: simplifiedAlbum.images[0].url,
                        albumUri: simplifiedAlbum.uri,
                        artistName: artist?.name,
                        artistGenres: artist?.genres,
                        artist: { name: artist?.name, id: artist?.id, genres: artist?.genres }
                    }
                })))

            }
        })();
    }

    return (
        <>
            <div className="container" style={{padding: '0 0 100px 0'}}>
                <Grid container spacing={2}>
                    <Grid xs={12} item={true}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack>
                                <TextField variant='outlined' InputLabelProps={{shrink: true}} margin="dense"
                                           type='text' {...register("searchText", {required: true})} />
                                <Button type='submit' variant='outlined' color='secondary'>Search</Button>
                            </Stack>
                        </form>
                    </Grid>
                    <Grid xs={12} item={true}>
                        <Grid container justifyContent="center" spacing={4}>
                            {results.map((album) => (
                                <Grid item={true} key={album.id}><AlbumCard simplifiedAlbum={album}
                                ></AlbumCard></Grid>
                            ))} </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}
