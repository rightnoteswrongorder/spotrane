import {useState} from 'react'
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import {
    Button,
    Stack,
    TextField
} from '@mui/material';
import {SubmitHandler, useForm} from 'react-hook-form';
import Grid from "@mui/material/Grid";
import {AlbumCard} from "./components/AlbumCard.tsx";
import {
    SpotraneAlbumCardView,
    SpotraneAlbumDto, SpotraneArtistDto,
    SpotraneSearchResultContainer
} from "../interfaces/SpotraneAlbum.ts";
import {SpotifyApiProxy} from "../api/spotify.ts";
import {SupabaseApi} from "../api/supabase.ts";
import {Tables} from "../interfaces/database.types.ts";

interface IFormInput {
    searchText: string
}

type SpotifySearchProps = {
    sdk: SpotifyApi | null,
    list?: Tables<'lists'>
}
export default function SpotifySearch({sdk, list}: SpotifySearchProps) {
    const [searchResults, setSearchResults] = useState<SpotraneSearchResultContainer[]>([]);
    const {register, handleSubmit} = useForm<IFormInput>()

    const addToListFromSearch = (list: Tables<'lists'>, artist: SpotraneArtistDto, album: SpotraneAlbumDto) => {
        SupabaseApi.addToListFromSearch(list, artist, album)
    }
    const saveAlbum = async (artist: SpotraneArtistDto, album: SpotraneAlbumDto) => {
        SupabaseApi.saveAlbum(album, artist)
    }

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        (async () => {
            const searchResults = await SpotifyApiProxy.searchForAlbum(sdk, data.searchText)
            if (searchResults) {

                setSearchResults(await Promise.all(searchResults.albums?.items.map(async (simplifiedAlbum) => {
                    const artist = await SpotifyApiProxy.getArtist(sdk, simplifiedAlbum.artists[0].id)
                    const spotraneArtist = {
                        id: artist?.id,
                        name: artist?.name,
                        genres: artist?.genres
                    } as SpotraneArtistDto
                    const album = await SpotifyApiProxy.getAlbum(sdk, simplifiedAlbum.id)
                    const spotraneAlbum = {
                        id: album?.id,
                        name: album?.name,
                        releaseDate: album?.release_date,
                        imageUri: album?.images[0].url,
                        albumUri: album?.uri,
                        label: album?.label,
                        artist: artist?.id
                    } as SpotraneAlbumDto
                    const isSaved = await SupabaseApi.isSaved(simplifiedAlbum.id)
                    const cardView = {
                        id: album?.id,
                        name: album?.name,
                        releaseDate: album?.release_date,
                        imageUri: album?.images[0].url,
                        albumUri: album?.uri,
                        label: album?.label,
                        artistId: artist?.id,
                        artistName: artist?.name,
                        artistGenres: artist?.genres.join(" ")

                    } as SpotraneAlbumCardView

                    return {
                        artist: spotraneArtist,
                        album: spotraneAlbum,
                        isSaved: isSaved,
                        view: cardView
                    } as SpotraneSearchResultContainer

                })))
            }
        })();
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid xs={12} item={true}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack margin={2}>
                            <TextField variant='outlined' InputLabelProps={{shrink: true}} margin="dense"
                                       type='text' {...register("searchText", {required: true})} />
                            <Button type='submit' variant='outlined' color='secondary'>Search</Button>
                        </Stack>
                    </form>
                </Grid>
                <Grid xs={12} item={true} margin={2}>
                    <Grid container justifyContent="center" spacing={4}>
                        {searchResults.map((container) => (
                            <Grid item={true} key={container.album.id}><AlbumCard albumCardView={container.view} artist={container.artist}
                                                                                  album={container.album} saved={container.isSaved}
                                                                                  list={list} addToListFromSearch={addToListFromSearch} saveAlbum={saveAlbum}

                            ></AlbumCard></Grid>
                        ))} </Grid>
                </Grid>
            </Grid>
        </>
    )
}
