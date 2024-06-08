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
import SpotifySearchDialog from "./components/SpotifySearchDialog.tsx";
import {Scopes} from "@spotify/web-api-ts-sdk";
import {SpotraneAlbumCard} from "../interfaces/spotrane.types.ts";
import AlertDialog from "./components/AlertDialog.tsx";
import {useSpotify} from "../hooks/useSpotfy.ts";

interface IFormInput {
    searchText: string
}

const Library = () => {
    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    const [albums, setAlbums] = useState<SpotraneAlbumCard[]>([]);
    const [searchTotal, setSearchTotal] = useState<number>(0)
    const [totalAlbums, setTotalAlbums] = useState<number>(0)
    const nextId = useRef(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showSearchSpotifyDialog, setShowSpotifyDialog] = useState(false)
    const [showCannotDeleteMessage, setShowCannotDeleteMessage] = useState("")

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
        return (async () => {
            const result = await SupabaseApi.deleteAlbum(albumId)
            if (result.status == 409) {
                const msg = "Cannot delete: " + result.error?.details
                setShowCannotDeleteMessage(msg)
            } else {
                const updated = albums?.filter(libraryAlum => libraryAlum.id != albumId)
                setAlbums(updated)
            }
        });
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
        allAlbums(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage)
        event && setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const {register, handleSubmit, reset, getValues} = useForm<IFormInput>()

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
        <>
            <Grid xs={12} item={true}>
                {showSearchSpotifyDialog && <SpotifySearchDialog isOpen={showSearchSpotifyDialog} sdk={sdk} handleClose={handleClose} startText={getValues("searchText")}/>}
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
            <Grid xs={12} item={true} marginTop={2}>
                <Grid container justifyContent="center" spacing={3}>
                    {albums?.map(album => (
                        <Grid key={nextId.current++} item={true}><AlbumCard albumCardView={album}
                                                                            addToList={addToList(album)}
                                                                            deleteAlbumFromLibrary={deleteAlbumFromLibrary(album.id)}/></Grid>))}
                </Grid>
            </Grid>
            <Grid container justifyContent="right" spacing={2} marginTop={2}>
                <Grid marginRight={5} item={true}>{searchTotal == 0 ? <TablePagination component='div'
                                                                       labelRowsPerPage="Results: "
                                                                       rowsPerPageOptions={[5, 10, 15, 20, 50, 100, 200, 300, 400]}
                                                                       count={totalAlbums}
                                                                       page={page} rowsPerPage={rowsPerPage}
                                                                       onPageChange={handleChangePage}
                                                                       onRowsPerPageChange={handleChangeRowsPerPage}/> :
                    <Typography>Search Results: {searchTotal}</Typography>}</Grid>
            </Grid>
            {showCannotDeleteMessage != "" && <AlertDialog message={showCannotDeleteMessage}/> }
        </>
    )
}

export default Library
