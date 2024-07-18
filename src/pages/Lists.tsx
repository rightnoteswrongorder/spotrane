import Grid from "@mui/material/Grid";
import {Button, FormControl, InputLabel, MenuItem, Select, Stack,} from "@mui/material";
import * as React from "react";
import {ReactElement, useEffect, useState} from "react";
import {Tables} from "../interfaces/database.types.ts";
import {Controller, useForm} from "react-hook-form";
import {AlbumCard, AlbumCardProps} from "./components/AlbumCard.tsx";
import {SupabaseApi} from "../api/supabase.ts";
import SpotifySearchDialog from "./components/SpotifySearchDialog.tsx";
import {Scopes} from "@spotify/web-api-ts-sdk";
import {useSpotify} from "../hooks/useSpotfy.ts";
import supabase from "../api/supaBaseClient.ts";
import {RealtimePostgresChangesPayload} from "@supabase/supabase-js";
import {SpotraneAlbumCard, SpotraneList} from "../interfaces/spotrane.types.ts";
import YesNoDialog from "./components/YesNoDialog.tsx";
import DraggableGrid from "./components/dnd/DraggableGrid.tsx";
import {useNavigate, useParams} from "react-router-dom";

interface IFormInput {
    listName: string
}

export type ListEntry = {
    item: SpotraneAlbumCard
    id: number
    position: number
    render: () => ReactElement<AlbumCardProps>

}
const Lists = () => {
    const navigate = useNavigate()

    const [albums, setAlbums] = useState<ListEntry[]>([]);
    const [selectedList, setSelectedList] = useState<SpotraneList>()
    const [lists, setLists] = React.useState<SpotraneList[]>([]);
    const [showSearchSpotifyDialog, setShowSpotifyDialog] = useState(false)
    const [newListEntry, setNewListEntry] = useState("")
    const [albumUpdated, setAlbumUpdated] = useState("")
    const [listEntryDeleted, setListEntryDeleted] = useState("")
    const [newListAdded, setNewListAdded] = useState("")


    const handleNewListEntry = (payload: RealtimePostgresChangesPayload<Tables<'list_entry'>>) => {
        setNewListEntry(payload.commit_timestamp)
    }

    const handleEntryDeletedFromList = (payload: RealtimePostgresChangesPayload<Tables<'list_entry'>>) => {
        setListEntryDeleted(payload.commit_timestamp)
    }

    const handleaAlbumUpdate = (payload: RealtimePostgresChangesPayload<Tables<'albums'>>) => {
        setAlbumUpdated(payload.commit_timestamp)
    }

    const handleNewList = (payload: RealtimePostgresChangesPayload<Tables<'lists'>>) => {
        const list = payload.new as Tables<'lists'>
        setNewListAdded(list.name ? list.name : "")
    }

    const addToList = (albumCardView: SpotraneAlbumCard) => {
        return (listId: number) => {
            SupabaseApi.addToList(listId, albumCardView)
        }
    }

    const params = useParams()

    useEffect(()  => {
        (async () => {
            const listToSet = newListAdded ? newListAdded : params.listName
            await getAllLists(listToSet)
        })()

        supabase.channel('album_update').on<Tables<'albums'>>('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'albums' },
                handleaAlbumUpdate).subscribe()

        supabase.channel('list_entry_insert').on<Tables<'list_entry'>>('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'list_entry'
        }, handleNewListEntry).subscribe()

        supabase.channel('list_entry_delete').on<Tables<'list_entry'>>('postgres_changes', {
            event: 'DELETE',
            schema: 'public',
            table: 'list_entry'
        }, handleEntryDeletedFromList).subscribe()

        supabase.channel('lists').on<Tables<'lists'>>('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'lists'
        }, handleNewList).subscribe()

    }, [newListAdded]);


    useEffect(() => {
        console.log("Before - " + selectedList?.name)
        if(selectedList || newListEntry) {
            console.log("Before - " + selectedList?.name)
           navigate(`/lists/${selectedList?.name}`)
        }
        albumsOnList()
    }, [selectedList, newListEntry, listEntryDeleted, albumUpdated]);

    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    const deleteAlbumFromList = (albumId: string) => {
        return async () => selectedList && await SupabaseApi.deleteAlbumFromList(selectedList.id, albumId)
    }

    const getAllLists = async (onPath?: string) => {
        const data = await SupabaseApi.getLists()
        const spotraneLists = data && data.map(dbList => {
            return {
                id: dbList.id,
                name: dbList.name
            } as SpotraneList
        })

        if (onPath) {
            const res = spotraneLists?.find(list => list.name == onPath)
            res && setSelectedList(res)
        }



        spotraneLists && setLists(spotraneLists)

    }


    const albumsOnList = () => {
        (async () => {
                if (selectedList && selectedList.name) {
                    const albums = await SupabaseApi.getAlbumsOnList(selectedList?.name)
                    albums && setAlbums(albums.map((dbAlbum) => {
                        const album = {
                            id: dbAlbum.spotify_id,
                            name: dbAlbum.name,
                            artistId: dbAlbum.artist_spotify_id,
                            artistName: dbAlbum.artist,
                            artistGenres: dbAlbum.artist_genres,
                            label: dbAlbum.label,
                            releaseDate: dbAlbum.release_date,
                            imageUri: dbAlbum.image,
                            albumUri: dbAlbum.spotify_uri,
                            rating: dbAlbum.rating,
                            isSaved: true
                        } as SpotraneAlbumCard

                        return {
                            item: album,
                            id: dbAlbum.list_entry_id,
                            position: dbAlbum.list_entry_position,
                            render: () => <AlbumCard albumCardView={album}
                                                     addToList={addToList(album)}
                                                     deleteAlbumFromList={deleteAlbumFromList(album.id)}/>
                        } as ListEntry;

                    }).sort((a, b) => a.position > b.position ? 1 : -1))
                }
            }
        )();
    }

    const {control, reset} = useForm<IFormInput>()

    const resetMe = () => {
        handleReset();
    }

    const handleReset = () => {
        (async () => {
            setAlbums([])
            setSelectedList(undefined)
            reset()
            await getAllLists()
        })()
    }

    const [listDialogOpen, setListDialogOpen] = useState<boolean>(false);
    const [deleteListDialogOpen, setDeleteListDialogOpen] = useState<boolean>(false);
    const [renameListDialogOpen, setRenameListDialogOpen] = useState<boolean>(false);

    const handleCreateList = () => {
        setListDialogOpen(true)
    }

    const handleDeleteList = () => {
        setDeleteListDialogOpen(true)
    }

    const createListSubmitEnabled = (data: string) => {
        return newList(data) && data != ""
    }

    const deleteListSubmitEnabled = (data: string) => {
        return !!(selectedList && data == selectedList?.name)
    }

    const handleDeleteListDialogClose = () => {
        setDeleteListDialogOpen(false)
    }

    const handleCreateListDialogClose = () => {
        setListDialogOpen(false)
    }

    const renameListSubmitEnabled = (data: string) => {
        return !!(selectedList && data != selectedList?.name) && newList(data) && data != ""
    }

    const newList = (listName: string): boolean => {
        return lists.map(list => list.name).find(list => list == listName) == undefined
    }

    const handleRenameList = () => {
        setRenameListDialogOpen(true)
    }

    const handleRenameListDialogClose = () => {
        setRenameListDialogOpen(false)
    }

    const runListLoad = (listName: string) => {
        const list = lists.find(list => list?.name == listName)
        console.log("list load: " + list?.name)
        list && setSelectedList(list)
    }

    const onShowSpotifySearch = () => {
        setShowSpotifyDialog(true)
    }

    const handleClose = () => {
        console.log(selectedList?.name)
        getAllLists()
        setSelectedList(selectedList)
        setShowSpotifyDialog(false);
    };

    const createList = (name: string) => {
        (async () => {
            await SupabaseApi.createList(name)
        })();
    }

    const createListDialogTitle = "Create List: "

    const createListDialogSubTitle = "Enter a unique name..."

    const deleteList = (name: string) => {
        (async () => {
            if (selectedList && name == selectedList.name) {
                await SupabaseApi.deleteList(selectedList.id)
            }
            handleReset()
        })();
    }

    const deleteListDialogTitle = "Delete List: "

    const deleteListDialogSubTitle = "Enter name to confirm permanent deletion"

    const renameList = (newName: string) => {
        (async () => {
            if (selectedList) {
                await SupabaseApi.renameList(selectedList.id, newName)
            }
            handleReset()
        })();
    }

    const renameListDialogTitle = "Rename List: "

    const renameListDialogSubTitle = "Enter a unique new name..."


    const saveListEntry = (entryId: number, position: number) => {
        return async () => {
            await SupabaseApi.updateListEntryPriority(entryId, position)
        }

    }

    return (
        <>
            <Grid xs={12} item={true}>
                {selectedList && showSearchSpotifyDialog &&
                    <SpotifySearchDialog sdk={sdk} albumsOnList={albums} isOpen={showSearchSpotifyDialog} handleClose={handleClose}
                                         listId={selectedList.id} listVisible={true}/>}
                <form>
                    <Stack sx={{paddingLeft: 5, paddingRight: 5}} spacing={1} marginBottom={2}>
                        <Controller
                            control={control}
                            name="listName"
                            render={({field: {onChange}}) => (
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">List</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        type="submit"
                                        value={selectedList ? selectedList.name : ""}
                                        onChange={(e) => {
                                            onChange(e)
                                            runListLoad(e.target.value)
                                        }}
                                        label="List"
                                    >
                                        {
                                            lists.sort((a, b) =>
                                                a.name > b.name ? 1 : -1
                                            ).map(item => {
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
                        <Button variant='outlined' disabled={!selectedList} onClick={resetMe}
                                color='secondary'>Reset</Button>
                        <Button variant='outlined' onClick={handleCreateList} color='secondary'>Create New
                            List</Button>
                        <Button variant='outlined' disabled={!selectedList} onClick={handleDeleteList}
                                color='secondary'>Delete List</Button>
                        <Button variant='outlined' disabled={!selectedList} onClick={handleRenameList}
                                color='secondary'>Rename List</Button>
                        <Button variant='outlined' disabled={!selectedList} onClick={onShowSpotifySearch}
                                color='secondary'>Search
                            Spotify</Button>
                        {listDialogOpen &&
                            <YesNoDialog title={createListDialogTitle} label={"List name"} confirmButtonLabel={"Create"}
                                         confirmEnabled={createListSubmitEnabled}
                                         subTitle={createListDialogSubTitle} isOpen={true}
                                         handleSubmit={createList} handleClose={handleCreateListDialogClose}/>}
                        {deleteListDialogOpen && selectedList &&
                            <YesNoDialog title={deleteListDialogTitle} label={"List name"} confirmButtonLabel={"Delete"}
                                         confirmEnabled={deleteListSubmitEnabled}
                                         subTitle={deleteListDialogSubTitle} isOpen={true}
                                         handleSubmit={deleteList} handleClose={handleDeleteListDialogClose}/>}
                        {renameListDialogOpen && selectedList &&
                            <YesNoDialog title={renameListDialogTitle} label={"List name"} confirmButtonLabel={"Rename"}
                                         confirmEnabled={renameListSubmitEnabled}
                                         subTitle={renameListDialogSubTitle} isOpen={true}
                                         handleSubmit={renameList} handleClose={handleRenameListDialogClose}/>}
                    </Stack>
                </form>
            </Grid>
            <DraggableGrid start={albums} save={saveListEntry}/>
        </>
    )
}

export default Lists