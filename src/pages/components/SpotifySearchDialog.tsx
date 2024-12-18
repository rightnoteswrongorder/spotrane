import {useEffect, useState} from 'react'
import {Album, Artist, SpotifyApi} from "@spotify/web-api-ts-sdk";
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
import {ListEntry} from "../Lists.tsx";

interface IFormInput {
    searchText: string
}

type SpotifySearchProps = {
    sdk: SpotifyApi | null,
    isOpen: boolean,
    handleClose: () => void,
    listId?: number,
    listVisible?: boolean,
    albumsOnList?: ListEntry[],
    startText?: string,
}

const SpotifySearchDialog = ({
                                 sdk,
                                 isOpen,
                                 handleClose,
                                 listId,
                                 listVisible,
                                 albumsOnList,
                                 startText
                             }: SpotifySearchProps) => {
    const [open, setOpen] = React.useState(false);
    const [searchResults, setSearchResults] = useState<SpotraneAlbumCard[]>([]);
    const {register, handleSubmit, setValue} = useForm<IFormInput>()
    const [searchLoading, setSearchLoading] = useState(false)

    const addToList = (albumCardView: SpotraneAlbumCard) => {
        return (listId: number) => {
            listId && SupabaseApi.addToList(listId, albumCardView)
        }
    }

    const addToVisibleList = (albumCardView: SpotraneAlbumCard, listId?: number) => {
        return () => {
            listId && SupabaseApi.addToList(listId, albumCardView)
        }
    }

    const isOnVisibleList = (albumId: string) => {
        return albumsOnList?.find((album) => album.item.id == albumId) !== undefined
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

        setOpen(isOpen)

        if (startText && startText != "") {
            setValue("searchText", startText)
            handleSubmit(onSubmit)()
        }
    }, []);

    useEffect(() => {
        setSearchLoading(false)
    }, [searchResults]);

    const findByUrl: SubmitHandler<IFormInput> = (data) => {
        const id = new URL(data.searchText).pathname.split("/")[2]
        findById(id)
    }

    const findById  = (id: string) => {
        (async () => {
            setSearchLoading(true)
            const result = await SpotifyApiProxy.getAlbum(sdk, id)
            if (result) {
                const artist = await SpotifyApiProxy.getArtist(sdk, result?.artists[0].id)
                const album = await SpotifyApiProxy.getAlbum(sdk, result?.id)
                const isSaved = await SupabaseApi.isSaved(result?.id)
                const spotraneAlbum = spotifyAlbumToSpotraneAlbum(album, artist, isSaved)
                setSearchResults([spotraneAlbum])
            }
        })();
    }


    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        (async () => {
            setSearchLoading(true)
            const searchResults = await SpotifyApiProxy.searchForAlbum(sdk, data.searchText)
            if (searchResults) {
                const results = await Promise.all(searchResults.albums?.items.map(async (simplifiedAlbum) => {
                    const artist = await SpotifyApiProxy.getArtist(sdk, simplifiedAlbum.artists[0].id)
                    const album = await SpotifyApiProxy.getAlbum(sdk, simplifiedAlbum.id)
                    const isSaved = await SupabaseApi.isSaved(simplifiedAlbum.id)
                    return spotifyAlbumToSpotraneAlbum(album, artist, isSaved)
                }))
                setSearchResults(results)
            }
        })();
    }

    const spotifyAlbumToSpotraneAlbum = (album: Album | undefined, artist: Artist | undefined, isSaved: boolean): SpotraneAlbumCard => {
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
                                <Button type='submit' onClick={handleSubmit(findByUrl)} variant='outlined'
                                        color='secondary'>Find By Url</Button>
                            </Stack>
                        </form>
                    </Grid>
                    <Grid xs={12} item={true} margin={2}>
                        <Grid container justifyContent="center" spacing={4}>
                            {searchLoading ? <PageLoadSpinner/> :
                                searchResults.map((album) => (
                                    <Grid item={true} key={album.id}><AlbumCard albumCardView={album}
                                                                                addToVisibleList={addToVisibleList(album, listId)}
                                                                                isOnVisibleList={isOnVisibleList(album.id)}
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