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
import {SpotraneAlbum} from "../interfaces/SpotraneAlbum.ts";
import {SupabaseApi} from "../api/supabase.ts";

interface IFormInput {
    searchText: string
}

export default function Library() {
    const [albums, setAlbums] = useState<SpotraneAlbum[]>([]);
    const [searchTotal, setSearchTotal] = useState<number>(0)
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

    const allAlbums = (from: number, to: number) => {
        (async () => {
            const data = await SupabaseApi.getAllAlbums(from, to)
            setAlbums(dbAlbumToSpotrane(data))
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

