import MenuBar from "./components/MenuBar.tsx";
import Grid from "@mui/material/Grid";
import {
    Button,
    Stack,
    TablePagination, TextField, Typography,
} from "@mui/material";
import {MouseEvent, ChangeEvent, useEffect, useRef, useState} from "react";
import {Tables} from "../interfaces/database.types.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {AlbumCard} from "./components/AlbumCard.tsx";
import {SupabaseApi} from "../api/supabase.ts";
import SpotifySearch from "./SpotifySearch.tsx";
import Dialog from "@mui/material/Dialog";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import {SpotraneAlbumCard} from "../interfaces/SpotraneTypes.ts";

interface IFormInput {
    searchText: string
}

export default function Library({sdk}: { sdk: SpotifyApi | null }) {
    const [albums, setAlbums] = useState<SpotraneAlbumCard[]>([]);
    const [searchTotal, setSearchTotal] = useState<number>(0)
    const [totalAlbums, setTotalAlbums] = useState<number>(0)
    const nextId = useRef(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showSearchSpotifyDialog, setShowSpotifyDialog] = useState(false)

    const spotraneAlbum = (dbAlbums: Tables<'all_albums_view'>[]): SpotraneAlbumCard[] => {
        return dbAlbums.map(dbAlbum => {
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
        })
    }

    const addToList = (albumCardView: SpotraneAlbumCard) => {
        return (listId: number) => {
            SupabaseApi.addToListFromSearch(listId, albumCardView)
        }
    }

    const deleteAlbumFromLibrary = (albumId: string) => {
        return () => {
            SupabaseApi.deleteAlbum(albumId)
            const updated = albums?.filter(libraryAlum => libraryAlum.id != albumId)
            setAlbums(updated)
        }
    }

    const allAlbums = (from: number, to: number) => {
        (async () => {
            const data = await SupabaseApi.getAllAlbums(from, to)
            setAlbums(spotraneAlbum(data))
        })();
    }

    const countAlbums = () => {
        (async () => {
            const count = await SupabaseApi.countAlbums()
            setTotalAlbums(count)
        })();
    }

    useEffect(() => {
        countAlbums()
        allAlbums(page, rowsPerPage)
    }, [rowsPerPage]);

    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        console.log(event?.target)
        allAlbums(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const {register, handleSubmit, reset} = useForm<IFormInput>()

    const onReset = () => {
        reset();
        setPage(0)
        setSearchTotal(0)
        setRowsPerPage(5)
        allAlbums(page, rowsPerPage)
    }

    const runSearch = (searchText: string) => {
        (async () => {
            const data = await SupabaseApi.searchAllAlbums(searchText);
            setPage(0)
            setSearchTotal(data.length)
            setAlbums(spotraneAlbum(data))
        })();
    }

    const onSubmit: SubmitHandler<IFormInput> = (formData) => {
        runSearch(formData.searchText)
    }

    const onShowSpotifySearch = () => {
        setShowSpotifyDialog(true)
    }

    const handleClose = () => {
        setShowSpotifyDialog(false);
    };

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
                        <SpotifySearch sdk={sdk}/>
                    </Dialog>
                    <form>
                        <Stack sx={{paddingLeft: 5, paddingRight: 5}} spacing={1}>
                            <TextField variant='outlined' InputLabelProps={{shrink: true}} margin="dense"
                                       type='text' {...register("searchText", {required: true})} />
                            <Button type='submit' onClick={handleSubmit(onSubmit)} variant='outlined'
                                    color='secondary'>Search</Button>
                            <Button variant='outlined' onClick={onShowSpotifySearch} color='secondary'>Search
                                Spotify</Button>
                            <Button variant='outlined' onClick={onReset} color='secondary'>Reset</Button>
                        </Stack>
                    </form>
                </Grid>
                <Grid xs={12} item={true}>
                    <Grid container justifyContent="center" spacing={3}>
                        {albums?.map(album => (
                            <Grid key={nextId.current++} item={true}><AlbumCard albumCardView={album} addToList={addToList(album)}
                                                                                deleteAlbumFromLibrary={deleteAlbumFromLibrary(album.id)}/></Grid>))}
                    </Grid>
                </Grid>
                <Grid container justifyContent="right" spacing={2}>
                    <Grid item={true}>{searchTotal == 0 ? <TablePagination component='div'
                                                                           labelRowsPerPage="Results: "
                                                                           rowsPerPageOptions={[5, 10, 15, 20, 50, 100, 200, 300, 400]}
                                                                           count={totalAlbums}
                                                                           page={page} rowsPerPage={rowsPerPage}
                                                                           onPageChange={handleChangePage}
                                                                           onRowsPerPageChange={handleChangeRowsPerPage}/> :
                        <Typography>Search Results: {searchTotal}</Typography>}</Grid>
                </Grid>
            </Grid>
        </div>
    )
}

