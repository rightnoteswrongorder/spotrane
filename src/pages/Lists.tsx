import MenuBar from "./components/MenuBar.tsx";
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
import {SpotraneAlbum} from "../interfaces/SpotraneAlbum.ts";
import {SupabaseApi} from "../api/supabase.ts";
import Dialog from "@mui/material/Dialog";
import SpotifySearch from "./SpotifySearch.tsx";
import {Scopes} from "@spotify/web-api-ts-sdk";
import {useSpotify} from "../hooks/useSpotfy.ts";
import supabase from "../api/supaBaseClient.ts";
import {RealtimePostgresChangesPayload} from "@supabase/supabase-js";

interface IFormInput {
    listName: string
}

export default function Lists() {

    const [albums, setAlbums] = useState<SpotraneAlbum[]>([]);
    const [selectedList, setSelectedList] = useState<Tables<'lists'>>()
    const [lists, setLists] = React.useState<(Tables<'lists'> | null)[]>([]);
    const nextId = useRef(0);
    const [showSearchSpotifyDialog, setShowSpotifyDialog] = useState(false)


    const handleDbChange = (payload: RealtimePostgresChangesPayload<Tables<'lists'>>) => {
        const data = payload.new as Tables<'lists'>
        data.albums && albumsOnList(data.albums)
    }


    useEffect(() => {
        supabase.channel('lists').on<Tables<'lists'>>('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'lists'
        }, handleDbChange).subscribe()

        supabase.channel('lists').on<Tables<'lists'>>('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'lists'
        }, handleDbChange).subscribe()
        getAllLists()
    }, []);

    useEffect(() => {
        selectedList && selectedList.albums && albumsOnList(selectedList?.albums)
    }, [selectedList, setSelectedList]);

    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    const deleteAlbumFromList = (albumId: string) => {
        if (selectedList) {
            SupabaseApi.deleteAlbumFromList(selectedList, albumId)
            const updated = albums?.filter(listAlbums => listAlbums.id != albumId)
            setAlbums(updated)
        }
    }

    const getAllLists = () => {
        (async () => {
            const data = await SupabaseApi.getLists()
            data && setLists(data)
        })();
    }

    const albumsOnList = (albumIds: string[]) => {
        (async () => {
            const result = await SupabaseApi.getAlbumsByListOfIds(albumIds)
            setAlbums(result.map((dbAlbum) => {
                return {
                    id: dbAlbum.id,
                    name: dbAlbum.name,
                    artistName: dbAlbum.artist,
                    artistGenres: dbAlbum.genres ?? [],
                    label: dbAlbum.label,
                    releaseDate: dbAlbum.release_date,
                    imageUri: dbAlbum.image,
                    albumUri: dbAlbum.spotify_uri,
                    saved: true
                } as SpotraneAlbum
            }))
        })();
    }

    const {control, reset} = useForm<IFormInput>()

    const handleReset = () => {
        setAlbums([])
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
        const list = lists.find(list => list?.name === listName)
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

    const addToList = (album: SpotraneAlbum) => {
        selectedList && SupabaseApi.addToList(selectedList, album)
    }

    return (
        <div className="container" style={{padding: '0 0 100px 0'}}>
            <Grid container spacing={2}>
                <Grid xs={12} item={true}>
                    <MenuBar/>
                </Grid>
                <Grid xs={12} item={true}>
                    <Dialog open={showSearchSpotifyDialog}
                            onClose={handleClose}
                            fullWidth
                    >
                        <SpotifySearch sdk={sdk} addToList={addToList}/>
                    </Dialog>
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
                                                getAllLists()
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
                            <Button variant='outlined' onClick={handleReset} color='secondary'>Reset</Button>
                            <Button variant='outlined' onClick={handleCreateList} color='secondary'>Create New
                                List</Button>
                            <Button variant='outlined' onClick={onShowSpotifySearch} color='secondary'>Search
                                Spotify</Button>
                            {listDialogOpen &&
                                <CreateListDialog isOpen={true}
                                                  handleAddToListDialogClose={handleAddToListDialogClose}/>}
                        </Stack>
                    </form>
                </Grid>
                <Grid xs={12} item={true}>
                    <Grid container justifyContent="center" spacing={3}>
                        {albums?.map(album => (
                            <Grid key={nextId.current++} item={true}><AlbumCard album={album}
                                                                                deleteAlbumFromList={deleteAlbumFromList}/></Grid>))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

