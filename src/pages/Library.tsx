import Grid from "@mui/material/Grid";
import SpotifyIcon from "../static/images/spotify.svg?react"
import {
    Autocomplete,
    Box,
    IconButton,
    Stack, SvgIcon,
    TablePagination, TextField, Typography,
} from "@mui/material";
import {MouseEvent, ChangeEvent, useEffect, useRef, useState} from "react";
import {Tables} from "../interfaces/database.types.ts";
import {AlbumCard} from "./components/AlbumCard.tsx";
import {SupabaseApi} from "../api/supabase.ts";
import SpotifySearchDialog from "./components/SpotifySearchDialog.tsx";
import {Scopes} from "@spotify/web-api-ts-sdk";
import {SpotraneAlbumCard, SpotraneArtist} from "../interfaces/spotrane.types.ts";
import AlertDialog from "./components/AlertDialog.tsx";
import {useSpotify} from "../hooks/useSpotfy.ts";
import {debounce} from "lodash";

const Library = () => {
    const sdk = useSpotify(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_REDIRECT_TARGET,
        Scopes.all
    );

    const [albums, setAlbums] = useState<SpotraneAlbumCard[]>([]);
    const [artists, setArtists] = useState<SpotraneArtist[]>([]);
    const [searchTotal, setSearchTotal] = useState<number>(0)
    const [totalAlbums, setTotalAlbums] = useState<number>(0)
    const nextId = useRef(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [showSearchSpotifyDialog, setShowSpotifyDialog] = useState(false)
    const [showCannotDeleteMessage, setShowCannotDeleteMessage] = useState("")
    const [searchText, setSearchText] = useState("")


    useEffect(() => {
        countAlbums()
        allArtists()
        allAlbums(page, rowsPerPage)
    }, [rowsPerPage]);


    const updateRating = (card: SpotraneAlbumCard) => {
        return (rating: number) => {
            SupabaseApi.setRating(rating, card.id);
        }
    }


    const spotraneAlbum = (dbAlbums: Tables<'mother_list'>[]): SpotraneAlbumCard[] => {
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
                rating: dbAlbum.rating,
                appearsOn: dbAlbum.appears_on,
                isSaved: true
            } as SpotraneAlbumCard
        })
    }

    const addToList = (albumCardView: SpotraneAlbumCard) => {
        return (listId: number) => {
            SupabaseApi.addToList(listId, albumCardView)
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

    const allArtists = () => {
        (async () => {
            const artists = await SupabaseApi.getAllArtists()
            setArtists(artists.map(artist => {
                return {
                    id: artist.id,
                    name: artist.name
                } as SpotraneArtist
            }))
        })();
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

    const onReset = () => {
        setSearchText("")
        setPage(0)
        setSearchTotal(0)
        setRowsPerPage(0)
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

    const onShowSpotifySearch = () => {
        setShowSpotifyDialog(true)
    }

    const onCloseSpotifySearch = () => {
        setShowSpotifyDialog(false);
    };


    const onSearchTermChange = useRef(debounce(async (data: string | null, reason: string) => {
        if (reason === 'clear') {
            onReset()
        } else if (data) {
            setSearchText(data)
            runSearch(data)
        }
    }, 300)).current;


    return (
        <>
            <Grid xs={12} item={true}>
                {showSearchSpotifyDialog &&
                    <SpotifySearchDialog isOpen={showSearchSpotifyDialog} sdk={sdk} handleClose={onCloseSpotifySearch}
                                         startText={searchText}/>}
                <Stack sx={{paddingLeft: 5, paddingRight: 5}} alignItems="center" spacing={1}>
                    <Autocomplete
                        componentsProps={{
                            clearIndicator: {
                                onClick: () => {
                                    onReset()
                                }
                            }
                        }}
                        sx={{width: '100%'}}
                        disablePortal
                        value={searchText}
                        freeSolo
                        options={artists.map(a => a.name).sort()}
                        onInputChange={(_event, newVal, reason) => onSearchTermChange(newVal, reason)}
                        onChange={(_event, newVal, reason) => {
                            onSearchTermChange(newVal, reason)
                        }}
                        renderInput={(params) => <TextField {...params} label="Search Term"/>}
                    />
                    <IconButton onClick={onShowSpotifySearch}>
                        <SvgIcon component={SpotifyIcon} inheritViewBox/>
                    </IconButton>
                </Stack>
            </Grid>
            <Grid xs={12} item={true} marginTop={2}>
                <Grid container justifyContent="center" spacing={3}>
                    {albums?.map(album => (
                        <Grid key={nextId.current++} item={true}>
                            <Box boxShadow={2}>
                                <AlbumCard albumCardView={album}
                                           addToList={addToList(album)}
                                           updateRating={updateRating(album)}
                                           albums={albums}
                                           deleteAlbumFromLibrary={deleteAlbumFromLibrary(album.id)}/>
                            </Box>
                        </Grid>))}
                </Grid>
            </Grid>
            <Grid container justifyContent="right" spacing={2} marginTop={2}>
                {albums.length > 0 && <Grid marginRight={5} item={true}>{searchTotal == 0 ? <TablePagination component='div'
                                                                                       labelRowsPerPage="Results: "
                                                                                       rowsPerPageOptions={[5, 10, 15, 20, 50, 100, 200, 300, 400]}
                                                                                       count={totalAlbums}
                                                                                       page={page}
                                                                                       rowsPerPage={rowsPerPage}
                                                                                       onPageChange={handleChangePage}
                                                                                       onRowsPerPageChange={handleChangeRowsPerPage}/> :
                    <Typography>Search Results: {searchTotal}</Typography>}</Grid>}
            </Grid>
            {showCannotDeleteMessage != "" && <AlertDialog message={showCannotDeleteMessage}/>}
        </>
    )
}

export default Library
