import {useEffect, useState} from 'react'
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import {
    Button,
    Stack,
    TextField
} from '@mui/material';
import {SubmitHandler, useForm} from 'react-hook-form';
import Grid from "@mui/material/Grid";
import {AlbumCard} from "./AlbumCard.tsx";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";
import {SpotifyApiProxy} from "../../api/spotify.ts";
import {SupabaseApi} from "../../api/supabase.ts";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import PageLoadSpinner from "./PageLoadSpinner.tsx";
import {RealtimePostgresChangesPayload} from "@supabase/supabase-js";
import {Tables} from "../../interfaces/database.types.ts";
import supabase from "../../api/supaBaseClient.ts";

interface IFormInput {
    searchText: string
}

type SpotifySearchProps = {
    sdk: SpotifyApi | null,
    isOpen: boolean,
    handleClose: () => void,
    listId?: number,
    listVisible?: boolean,
    startText?: string,
}

const SpotifySearchDialog = ({sdk, isOpen, handleClose, listId, listVisible, startText}: SpotifySearchProps) => {
    const [open, setOpen] = React.useState(false);
    const [searchResults, setSearchResults] = useState<SpotraneAlbumCard[]>([]);
    const {register, handleSubmit, setValue} = useForm<IFormInput>()
    const [searchLoading, setSearchLoading] = useState(false)

    const [websocketUpdate, setWebSocketUpdate] = useState<Tables<'albums'>>()

    useEffect(() => {
        const album = websocketUpdate
        const spotifyAlbum = searchResults.find(result => result.id == album?.spotify_id)

        if (spotifyAlbum) {
            const newAlbum = {
                id: spotifyAlbum.id,
                name: spotifyAlbum.name,
                releaseDate: spotifyAlbum.releaseDate,
                imageUri: spotifyAlbum.imageUri,
                albumUri: spotifyAlbum.albumUri,
                label: spotifyAlbum.label,
                artistId: spotifyAlbum.artistId,
                artistName: spotifyAlbum.artistName,
                artistGenres: spotifyAlbum.artistGenres,
                isSaved: true
            }
            const newResults = searchResults.map(result => result.id == album?.spotify_id ? newAlbum : result)
            setSearchResults(newResults)
        }
    }, [websocketUpdate]);

    const handleDbChange = (payload: RealtimePostgresChangesPayload<Tables<'albums'>>) => {
        const album = payload.new as Tables<'albums'>
        setWebSocketUpdate(album)
    }

    const addToList = (albumCardView: SpotraneAlbumCard) => {
        return (listId: number) => {
            listId && SupabaseApi.addToListFromSearch(listId, albumCardView)
        }
    }

    const addToVisibleList = (albumCardView: SpotraneAlbumCard, listId?: number) => {
        return () => {
            listId && SupabaseApi.addToListFromSearch(listId, albumCardView)
        }
    }

    const saveAlbum = (albumCardView: SpotraneAlbumCard) => {
        return () => {
            SupabaseApi.saveAlbum(albumCardView)
        }
    }

    const handleLocalClose = () => {
        setOpen(false);
        handleClose()
    };

    useEffect(() => {
        supabase.channel('albums').on<Tables<'albums'>>('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'albums'
        }, handleDbChange).subscribe()

        setOpen(isOpen)

        if (startText && startText != "") {
            setValue("searchText", startText)
            handleSubmit(onSubmit)()
        }
    }, []);

    useEffect(() => {
        setSearchLoading(false)
    }, [searchResults]);

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        (async () => {
            setSearchLoading(true)
            const searchResults = await SpotifyApiProxy.searchForAlbum(sdk, data.searchText)
            if (searchResults) {
                const results = await Promise.all(searchResults.albums?.items.map(async (simplifiedAlbum) => {
                    const artist = await SpotifyApiProxy.getArtist(sdk, simplifiedAlbum.artists[0].id)
                    const album = await SpotifyApiProxy.getAlbum(sdk, simplifiedAlbum.id)
                    const isSaved = await SupabaseApi.isSaved(simplifiedAlbum.id)
                    return {
                        id: album?.id,
                        name: album?.name,
                        releaseDate: album?.release_date,
                        imageUri: album?.images[0].url,
                        albumUri: album?.uri,
                        label: album?.label,
                        artistId: artist?.id,
                        artistName: artist?.name,
                        artistGenres: artist?.genres,
                        isSaved: isSaved
                    } as SpotraneAlbumCard
                }))
                setSearchResults(results)
            }
        })();
    }

    return (
        <>
            <Dialog open={open}
                    disableRestoreFocus
                    onClose={handleLocalClose}
                    fullWidth
            >
                <Grid container spacing={2}>
                    <Grid xs={12} item={true}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack margin={2}>
                                <TextField autoFocus variant='outlined' InputLabelProps={{shrink: true}} margin="dense"
                                           type='text' {...register("searchText", {required: true})} />
                                <Button type='submit' variant='outlined' color='secondary'>Search</Button>
                            </Stack>
                        </form>
                    </Grid>
                    <Grid xs={12} item={true} margin={2}>
                        <Grid container justifyContent="center" spacing={4}>
                            {searchLoading ? <PageLoadSpinner/> :
                                searchResults.map((album) => (
                                    <Grid item={true} key={album.id}><AlbumCard albumCardView={album}
                                                                                addToVisibleList={addToVisibleList(album, listId)}
                                                                                listVisible={listVisible}
                                                                                addToList={addToList(album)}
                                                                                saveAlbum={saveAlbum(album)}

                                    ></AlbumCard></Grid>
                                ))} </Grid>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}

export default SpotifySearchDialog