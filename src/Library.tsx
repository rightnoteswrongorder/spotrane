import MenuBar from "./MenuBar.tsx";
import Grid from "@mui/material/Grid";
import {
    Box, Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Paper,
    Stack,
    styled,
    TablePagination, TextField,
    Typography
} from "@mui/material";
import supabase from "./supaBaseClient.ts";
import {useEffect, useRef, useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {Tables} from "./database.types.ts";
import {SubmitHandler, useForm} from "react-hook-form";


interface IFormInput {
    searchText: string
}

export default function Library() {
    const [albums, setAlbums] = useState<Tables<'all_albums'>[]>([]);
    const [totalAlbums, setTotalAlbums] = useState<number>(0)
    const nextId = useRef(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const all_albums = (from: number, to: number) => {
        (async () => {
            const {data} = await supabase
                .from('all_albums')
                .select("*")
                .range(from, to - 1)
            const f = data as Tables<'all_albums'>[]
            setAlbums(f)
        })();
    }

    const count_albums = () => {
        (async () => {
            const {count} = await supabase
                .from('all_albums')
                .select("*", {count: 'exact', head: true})
            count ? setTotalAlbums(count) : setTotalAlbums(0)
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

    const {register, handleSubmit} = useForm<IFormInput>()

    const handleReset  = () => {
        setPage(0)
        setRowsPerPage(5)
        all_albums(page, rowsPerPage)
    }

    const onSubmit: SubmitHandler<IFormInput> = (formData) => {
        (async () => {
            const {data, error} = await supabase
                .rpc('search_all_albums', {keyword:  formData.searchText.replace(" ", " | ")})
             if (error) {
                 console.error(error)
             }
             else {
                 setPage(0)
                 setTotalAlbums(data.length)
                 setAlbums(data)
             }
        })();
    }

    return (
        <div className="container" style={{padding: '0 0 100px 0'}}>
            <Grid container spacing={2}>
                <Grid xs={12} item={true}>
                    <MenuBar/>
                </Grid>
                <Grid xs={12} item={true}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack sx={{paddingLeft: 5, paddingRight: 5 }}spacing={1}>
                            <TextField variant='outlined' InputLabelProps={{shrink: true}} margin="dense"
                                       type='text' {...register("searchText", {required: true})} />
                            <Button type='submit' variant='outlined' color='secondary'>Search</Button>
                            <Button variant='outlined' onClick={handleReset} color='secondary'>Reset</Button>
                        </Stack>
                    </form>
                </Grid>
                <Grid xs={12} item={true}>
                    <Grid container justifyContent="center" spacing={3}>
                        {albums?.map(thing => (
                            <Grid key={nextId.current++} item={true}><PlaylistCard2 album={thing}/></Grid>))}
                    </Grid>
                </Grid>
                <Grid container justifyContent="right" spacing={2}>
                    <Grid item={true}><TablePagination component='div'
                                                       labelRowsPerPage="Results: "
                                                       rowsPerPageOptions={[5, 10, 15, 20, 50, 100, 200, 300, 400]}
                                                       count={totalAlbums}
                                                       page={page} rowsPerPage={rowsPerPage}
                                                       onPageChange={handleChangePage}
                                                       onRowsPerPageChange={handleChangeRowsPerPage}/></Grid>
                </Grid>
            </Grid>
        </div>
    )
}

styled(Paper)(({theme}) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    // ...theme.typography.body2,
    padding: theme.spacing(2),
    display: 'inline-flex',
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
type CreatePlaylistCardProps = {
    album: Tables<'all_albums'>
}
const PlaylistCard2 = ({album}: CreatePlaylistCardProps) => {

    return (<Card sx={{width: '350px', height: '200px', display: 'inline-flex'}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flex: '1 0 auto'}}>
                <Typography noWrap sx={{width: '200px'}} component="div" variant="h6">
                    {`${album?.name}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.artist}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.release_date?.substr(0, 4)} ${album?.label}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.genres}`}
                </Typography>
            </CardContent>
            <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
                <IconButton sx={{color: 'gray'}}
                            aria-label="unfollow">
                    <DeleteIcon></DeleteIcon>
                </IconButton>
                <IconButton sx={{color: 'gray'}} aria-label="save">
                    <FavoriteIcon></FavoriteIcon>
                </IconButton>
            </Box>
        </Box>
        <CardMedia
            component="img"
            sx={{width: 100, height: 100}}
            image={album?.image ? album?.image : ""}
            alt="album cover"
        />
    </Card>)
}
