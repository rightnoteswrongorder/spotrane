import Grid from "@mui/material/Grid";
import {
    Button,
    FormControl,
    InputLabel, MenuItem,
    Select,
    Stack,
} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {Tables} from "../interfaces/database.types.ts";
import {Controller, useForm} from "react-hook-form";
import * as React from "react";
import CreateListDialog from "./components/CreateListDialog.tsx";
import {AlbumCard} from "./components/AlbumCard.tsx";
import {SupabaseApi} from "../api/supabase.ts";
import SpotifySearchDialog from "./components/SpotifySearchDialog.tsx";
import {Scopes} from "@spotify/web-api-ts-sdk";
import {useSpotify} from "../hooks/useSpotfy.ts";
import supabase from "../api/supaBaseClient.ts";
import {RealtimePostgresChangesPayload} from "@supabase/supabase-js";
import {SpotraneAlbumCard} from "../interfaces/spotrane.types.ts";

interface IFormInput {
    listName: string
}

const Lists = () => {

    const [albums, setAlbums] = useState<SpotraneAlbumCard[]>([]);
    const [selectedList, setSelectedList] = useState<Tables<'lists'>>()
    const [lists, setLists] = React.useState<(Tables<'lists'> | null)[]>([]);
    const nextId = useRef(0);
    const [showSearchSpotifyDialog, setShowSpotifyDialog] = useState(false)
    const [websocketUpdate, setWebSocketUpdate] = useState("")


    const handleDbChange = (payload: RealtimePostgresChangesPayload<Tables<'list_entry'>>) => {
        setWebSocketUpdate(payload.commit_timestamp)
    }

    const addToList = (albumCardView: SpotraneAlbumCard) => {
        return (listId: number) => {
            SupabaseApi.addToListFromSearch(listId, albumCardView)
        }
    }

    useEffect(() => {
        supabase.channel('list_entry').on<Tables<'list_entry'>>('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'list_entry'
        }, handleDbChange).subscribe()

        getAllLists()
    }, []);

    useEffect(() => {
        albumsOnList()
    }, [selectedList, websocketUpdate]);

    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    const deleteAlbumFromList = (albumId: string) => {
        return () => {
            if (selectedList) {
                SupabaseApi.deleteAlbumFromList(selectedList, albumId)
                const updated = albums?.filter(listAlbums => listAlbums.id != albumId)
                setAlbums(updated)
            }
        }
    }

    const getAllLists = () => {
        (async () => {
            const data = await SupabaseApi.getLists()
            data && setLists(data)
        })();
    }

    const albumsOnList = () => {
        (async () => {
                if (selectedList && selectedList.name) {
                    const tryme = await SupabaseApi.getAlbumsOnList(selectedList?.name)
                    tryme && setAlbums(tryme.map((dbAlbum) => {
                        return {
                            id: dbAlbum.spotify_id,
                            name: dbAlbum.name,
                            artistId: dbAlbum.artist_spotify_id,
                            artistName: dbAlbum.artist,
                            artistGenres: dbAlbum.artist_genres,
                            label: dbAlbum.label,
                            releaseDate: dbAlbum.release_date,
                            imageUri: dbAlbum.image,
                            albumUri: dbAlbum.spotify_uri,
                            isSaved: true
                        } as SpotraneAlbumCard

                    }))
                }
            }
        )();
    }

    const {control, reset} = useForm<IFormInput>()

    const handleReset = () => {
        setAlbums([])
        setSelectedList(undefined)
        reset()
        getAllLists()
    }

    const [listDialogOpen, setListDialogOpen] = useState<boolean>(false);

    const handleCreateList = () => {
        setListDialogOpen(true)
    }

    const handleAddToListDialogClose = () => {
        setListDialogOpen(false)
    }

    const runListLoad = (listName: string) => {
        const list = lists.find(list => list?.name == listName)
        list && setSelectedList(list)
    }

    const onShowSpotifySearch = () => {
        setShowSpotifyDialog(true)
    }

    const handleClose = () => {
        getAllLists()
        setSelectedList(selectedList)
        setShowSpotifyDialog(false);
    };

    return (
        <>
            <Grid xs={12} item={true}>
                {selectedList && showSearchSpotifyDialog &&
                    <SpotifySearchDialog sdk={sdk} isOpen={showSearchSpotifyDialog} handleClose={handleClose}
                                         listId={selectedList.id} listVisible={true}/>}
                <form>
                    <Stack sx={{paddingLeft: 5, paddingRight: 5}} spacing={1}>
                        <Controller
                            control={control}
                            name="listName"
                            render={({field: {onChange, value}}) => (
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">List</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        type="submit"
                                        value={value ?? ""}
                                        onChange={(e) => {
                                            onChange(e)
                                            runListLoad(e.target.value)
                                        }}
                                        label="List"
                                    >
                                        {
                                            lists.map(item => {
                                                if (item && item.name) {
                                                    return <MenuItem key={item.name}
                                                                     value={item.name}>{item.name}</MenuItem>
                                                }
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Button variant='outlined' disabled={!selectedList} onClick={handleReset}
                                color='secondary'>Reset</Button>
                        <Button variant='outlined' onClick={handleCreateList} color='secondary'>Create New
                            List</Button>
                        <Button variant='outlined' disabled={!selectedList} onClick={onShowSpotifySearch}
                                color='secondary'>Search
                            Spotify</Button>
                        {listDialogOpen &&
                            <CreateListDialog isOpen={true}
                                              handleAddToListDialogClose={handleAddToListDialogClose}/>}
                    </Stack>
                </form>
            </Grid>
            <Grid xs={12} item={true} marginTop={2}>
                <Grid container justifyContent="center" spacing={3}>
                    {albums?.map(album => (
                        <Grid key={nextId.current++} item={true}><AlbumCard albumCardView={album}
                                                                            addToList={addToList(album)}
                                                                            deleteAlbumFromList={deleteAlbumFromList(album.id)}/></Grid>))}
                </Grid>
            </Grid>
        </>
    )
}

export default Lists