import MenuBar from "./components/MenuBar.tsx";
import Grid from "@mui/material/Grid";
import {
    Button,
    Stack,
    TablePagination, TextField,
} from "@mui/material";
import supabase from "../api/supaBaseClient.ts";
import {useEffect, useRef, useState} from "react";
import {Tables} from "../interfaces/database.types.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {AlbumCard} from "./components/AlbumCard.tsx";
import {SpotraneAlbum} from "../interfaces/SpotraneAlbum.ts";
import {getAllAlbums, searchAllAlbums} from "../api/supabase.ts";

interface IFormInput {
    searchText: string
}

export default function Library() {
    const [albums, setAlbums] = useState<SpotraneAlbum[]>([]);
    const [retrievedAlbums, setRetrievedAlbums] = useState<number>(0)
    const [totalAlbums, setTotalAlbums] = useState<number>(0)
    const nextId = useRef(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dbAlbumToSpotrane = (dbAlbums: Tables<'all_albums'>[]): SpotraneAlbum[] => {
        return dbAlbums.map(dbAlbum => {
            return {
                id: dbAlbum.id,
                name: dbAlbum.name,
                artistName: dbAlbum.artist,
                artistGenres: dbAlbum.genres ?? [],
                label: dbAlbum.label,
                releaseDate: dbAlbum.release_date,
                imageUri: dbAlbum.image,
                uri: dbAlbum.spotify_uri,
            } as SpotraneAlbum
        })
    }

    const all_albums = (from: number, to: number) => {
        (async () => {
            const data = await getAllAlbums(from, to - 1)
            if (data) {
                setAlbums(dbAlbumToSpotrane(data))
            }
        })();
    }

    const count_albums = () => {
        (async () => {
            const {count} = await supabase
                .from('all_albums')
                .select("*", {count: 'exact', head: true})
            if(count) {
                setTotalAlbums(count)
                setRetrievedAlbums(count)
            }
        })();
    }

    useEffect(() => {
        count_albums()
        all_albums(page, rowsPerPage)
    }, [rowsPerPage]);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        console.log(event?.target)
        all_albums(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const {register, handleSubmit, reset} = useForm<IFormInput>()

    const onReset = () => {
        reset();
        setPage(0)
        setRetrievedAlbums(totalAlbums)
        setRowsPerPage(5)
        all_albums(page, rowsPerPage)
    }

    const runSearch = (searchText: string) => {
        (async () => {
            const data = await searchAllAlbums(searchText);
            setPage(0)
            setRetrievedAlbums(data.length)
            setAlbums(dbAlbumToSpotrane(data))
        })();
    }

    const onSubmit: SubmitHandler<IFormInput> = (formData) => {
        runSearch(formData.searchText)
    }

    return (
        <div className="container" style={{padding: '0 0 100px 0'}}>
            <Grid container spacing={2}>
                <Grid xs={12} item={true}>
                    <MenuBar/>
                </Grid>
                <Grid xs={12} item={true}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack sx={{paddingLeft: 5, paddingRight: 5}} spacing={1}>
                            <TextField variant='outlined' InputLabelProps={{shrink: true}} margin="dense"
                                       type='text' {...register("searchText", {required: true})} />
                            <Button type='submit' variant='outlined' color='secondary'>Search</Button>
                            <Button variant='outlined' onClick={onReset} color='secondary'>Reset</Button>
                        </Stack>
                    </form>
                </Grid>
                <Grid xs={12} item={true}>
                    <Grid container justifyContent="center" spacing={3}>
                        {albums?.map(album => (
                            <Grid key={nextId.current++} item={true}><AlbumCard simplifiedAlbum={album}/></Grid>))}
                    </Grid>
                </Grid>
                <Grid container justifyContent="right" spacing={2}>
                    <Grid item={true}><TablePagination component='div'
                                                       labelRowsPerPage="Results: "
                                                       rowsPerPageOptions={[5, 10, 15, 20, 50, 100, 200, 300, 400]}
                                                       count={retrievedAlbums}
                                                       page={page} rowsPerPage={rowsPerPage}
                                                       onPageChange={handleChangePage}
                                                       onRowsPerPageChange={handleChangeRowsPerPage}/></Grid>
                </Grid>
            </Grid>
        </div>
    )
}

