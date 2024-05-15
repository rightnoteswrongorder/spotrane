import {useEffect, useState} from 'react'
import {useSpotify} from "./hooks/useSpotfy.ts";
import {
    Album,
    Artist,
    Scopes, SearchResults, SimplifiedAlbum,
    SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Paper,
    Stack,
    styled,
    TextField,
    Typography
} from '@mui/material';
import MenuBar from "./MenuBar.tsx";
import LoginForm from "./LoginForm.tsx";
import {useSession} from "./SessionProvider.tsx";
import {SubmitHandler, useForm} from 'react-hook-form';
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import supabase from "./supaBaseClient.ts";
import {PostgrestSingleResponse} from "@supabase/supabase-js";
import {Database} from "./database.types.ts";
import Grid from "@mui/material/Grid";

interface IFormInput {
    searchText: string
}

function App() {

    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    const session = useSession().session

    return (
        <div className="container" style={{padding: '0 0 100px 0'}}>
            <MenuBar/>
            {!session ? <LoginForm/> : <Box sx={{flexGrow: 1}}>
                <SpotifySearch sdk={sdk}/>
            </Box>}
        </div>
    )
}

function SpotifySearch({sdk}: { sdk: SpotifyApi | null }) {
    const [results, setResults] = useState<SearchResults<["album"]>>({} as SearchResults<["album"]>);

    const deleteAlbum = (album: Album) => {
        (async () => {
            await supabase.from('albums')
                .delete()
                .eq('id', album.id)
        })();
    }

    const upsertArtist = async (artist: Artist | undefined): Promise<PostgrestSingleResponse<Database['public']['Tables']['artists']['Row']> | undefined> => {
        if (artist) {
            return supabase.from('artists')
                .upsert([
                    {
                        id: artist.id,
                        name: artist.name,
                        genres: artist.genres
                    }
                ]).select().single();
        }
    }

    const saveAlbum = (album: Album, artist: Artist) => {
        (async () => {
            const res = await upsertArtist(artist);
            if (res) {
                await supabase.from('albums')
                    .upsert([
                        {
                            id: album.id,
                            name: album.name,
                            artist: res.data?.id,
                            image: album.images[1].url,
                            release_date: album.release_date,
                            label: album.label,

                        },
                    ])
                    .select()
            }
        })();
    }

    const isSaved = (albumId: string): Promise<boolean | null> => {
        return (async () => {
            const result = await supabase
                .from('albums')
                .select("*")
                .eq('id', albumId)
            return result.data && result.data?.length > 0
        })();
    }

    const getAlbum = async (albumId: string): Promise<Album | undefined> => {
        return sdk?.albums.get(albumId)
    }

    const getArtist = async (artistId: string): Promise<Artist | undefined> => {
        return sdk?.artists.get(artistId)
    }

    const tableRows = results.albums?.items.map((album) => {
        return (
            <Grid item={true} key={album.id}><PlaylistCard2 isSaved={isSaved} getArtist={getArtist} getAlbum={getAlbum}
                                                            saveAlbum={saveAlbum}
                                                            deleteAlbum={deleteAlbum}
                                                            album={album}></PlaylistCard2></Grid>
        );
    });

    const {register, handleSubmit} = useForm<IFormInput>()

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        (async () => {
            const results = await sdk?.search(data.searchText, ["album"]);
            if (results)
                setResults(() => results);
        })();
    }

    return (
        <>
            <div className="container" style={{padding: '0 0 100px 0'}}>
                <Grid container spacing={2}>
                    <Grid xs={12} item={true}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack>
                                <TextField variant='outlined' InputLabelProps={{shrink: true}} margin="dense"
                                           type='text' {...register("searchText", {required: true})} />
                                <Button type='submit' variant='outlined' color='secondary'>Search</Button>
                            </Stack>
                        </form>
                    </Grid>
                    <Grid xs={12} item={true}>
                        <Grid container justifyContent="center" spacing={4}>
                            {tableRows}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    display: 'inline-flex',
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

type CreatePlaylistCardProps = {
    album: SimplifiedAlbum
    saveAlbum: (album: Album, artist: Artist) => void
    deleteAlbum: (album: Album) => void
    isSaved: (albumId: string) => Promise<boolean | null>
    getArtist: (artistId: string) => Promise<Artist | undefined>
    getAlbum: (albumId: string) => Promise<Album | undefined>
}

const PlaylistCard2 = ({album, saveAlbum, deleteAlbum, isSaved, getArtist, getAlbum}: CreatePlaylistCardProps) => {


    const [savedAlbum, setSavedAlbum] = useState<boolean>(false)
    const [artist, setArtist] = useState<Artist>()
    const [fullFatAlbum, setFullFatAlbum] = useState<Album>()

    useEffect(() => {
        if (album) {
            getArtist(album.artists[0].id).then(setArtist)
            getAlbum(album.id).then(setFullFatAlbum)
        }
    }, []);

    useEffect(() => {
        // bit of a hack
        isSavedAlbum()
    }, [fullFatAlbum, deleteAlbum])

    const isSavedAlbum = () => {
        if (album?.id) {
            isSaved(album?.id).then(res => {
                res ? setSavedAlbum(true) : setSavedAlbum(false)
            })
        }
    }

    const saveClickHandler = () => {
        if (fullFatAlbum && artist) {
            saveAlbum(fullFatAlbum, artist)
            setSavedAlbum(true)
        }
    }

    const deleteClickHandler = () => {
        if (fullFatAlbum) {
            deleteAlbum(fullFatAlbum)
            setSavedAlbum(false)
        }
    }

    return (<Card sx={{width: '350px', height: '200px', display: 'inline-flex'}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flex: '1 0 auto'}}>
                <Typography noWrap sx={{width: '200px'}} component="div" variant="h6">
                    {`${fullFatAlbum?.name}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${fullFatAlbum?.artists[0].name}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${fullFatAlbum?.release_date.substr(0, 4)} ${fullFatAlbum?.label}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${artist?.genres}`}
                </Typography>
            </CardContent>
            <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
                <IconButton onClick={deleteClickHandler} sx={{color: savedAlbum ? 'red' : 'gray'}}
                            aria-label="unfollow">
                    <DeleteIcon></DeleteIcon>
                </IconButton>
                <IconButton onClick={saveClickHandler} sx={{color: savedAlbum ? 'green' : 'gray'}} aria-label="save">
                    <FavoriteIcon></FavoriteIcon>
                </IconButton>
            </Box>
        </Box>
        <CardMedia
            component="img"
            sx={{width: 100, height: 100}}
            image={album?.images[1].url}
            alt="album cover"
        />
    </Card>)
}


export default App;
