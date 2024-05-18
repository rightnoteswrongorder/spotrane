import MenuBar from "./MenuBar.tsx";
import Grid from "@mui/material/Grid";
import {
    Box, Button,
    Card,
    CardContent,
    CardMedia,
    IconButton, Link, MenuItem,
    Paper, Select,
    Stack,
    styled,
    Typography
} from "@mui/material";
import supabase from "../supabase/supaBaseClient.ts";
import {useEffect, useRef, useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {Tables} from "../interfaces/database.types.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import LinkIcon from "@mui/icons-material/Link";
import * as React from "react";

interface IFormInput {
    listName: string
}

export default function Lists() {
    const [albums, setAlbums] = useState<Tables<'all_albums'>[]>([]);
    console.log(setAlbums)
    const nextId = useRef(0);

    const deleteAlbum = (albumId: string) => {
        (async () => {
            await supabase.from('albums')
                .delete()
                .eq('id', albumId)
        })();
    }


    useEffect(() => {
        getAllLists()
    }, []);


    // const runSearch = (searchText: string) => {
    //     (async () => {
    //         const {data, error} = await supabase
    //             .rpc('search_all_albums', {keyword: searchText.replace(" ", " | ")})
    //         if (error) {
    //             console.error(error)
    //         } else {
    //             setAlbums(data)
    //         }
    //     })();
    // }

    const [lists, setLists] = React.useState<(Tables<'lists'> | null)[]>([]);

    const getAllLists = () => {
        (async () => {
            const {data} = await supabase
                .from('lists')
                .select('*')
            const f = data as (Tables<'lists'> | null)[]
            setLists(f)
        })();
    }

    const {register, handleSubmit} = useForm<IFormInput>()

    const handleReset = () => {
    }

    const onSubmit: SubmitHandler<IFormInput> = (formData) => {
        setListName(formData.listName)
    }

    const [listName, setListName] = React.useState('');

    return (
        <div className="container" style={{padding: '0 0 100px 0'}}>
            <Grid container spacing={2}>
                <Grid xs={12} item={true}>
                    <MenuBar/>
                </Grid>
                <Grid xs={12} item={true}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack sx={{paddingLeft: 5, paddingRight: 5}} spacing={1}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={listName}
                                label="List"
                                {...register("listName")}
                            >
                                {
                                    lists.map(item => {
                                        if (item && item.name) {
                                            return <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                                        }
                                    })
                                }
                            </Select>
                            <Button type='submit' variant='outlined' color='secondary'>Search</Button>
                            <Button variant='outlined' onClick={handleReset} color='secondary'>Reset</Button>
                        </Stack>
                    </form>
                </Grid>
                <Grid xs={12} item={true}>
                    <Grid container justifyContent="center" spacing={3}>
                        {albums?.map(thing => (
                            <Grid key={nextId.current++} item={true}><PlaylistCard2 deleteAlbum={deleteAlbum}
                                                                                    album={thing}/></Grid>))}
                    </Grid>
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
    deleteAlbum: (albumId: string) => void
}
const PlaylistCard2 = ({album, deleteAlbum}: CreatePlaylistCardProps) => {


    const deleteClickHandler = () => {
        if (album && album.id) {
            deleteAlbum(album.id)
        }
    }

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
                <IconButton onClick={deleteClickHandler} sx={{color: 'red'}}
                            aria-label="unfollow">
                    <DeleteIcon></DeleteIcon>
                </IconButton>
                <Link href={album.spotify_uri ? album.spotify_uri : ''}>
                    <LinkIcon></LinkIcon>
                </Link>
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
