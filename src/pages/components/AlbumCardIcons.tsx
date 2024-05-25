import {Box, IconButton, Link, SvgIcon} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SpotifyIcon from "../../static/images/spotify.svg?react"
import {PlaylistAdd, PlaylistAddCheck} from "@mui/icons-material";
import {SpotraneAlbumCardView, SpotraneAlbumDto, SpotraneArtistDto} from "../../interfaces/SpotraneAlbum.ts";
import {Tables} from "../../interfaces/database.types.ts";

type AlbumCardIconProps = {
    albumCardView: SpotraneAlbumCardView
    album?: SpotraneAlbumDto
    artist?: SpotraneArtistDto
    list?: Tables<'lists'>
    saved?: boolean
    saveAlbum?: (artist: SpotraneArtistDto, album: SpotraneAlbumDto) => void
    deleteAlbumFromLibrary?: (albumId: string) => void
    deleteAlbumFromList?: (albumId: string) => void
    addToListFromSearch?: (list: Tables<'lists'>, artist: SpotraneArtistDto, album: SpotraneAlbumDto) => void
    toggleListDialog: () => void
}

export const AlbumCardIcons = ({
                                   albumCardView,
                                   album,
                                   artist,
                                   list,
                                   saved,
                                   saveAlbum,
                                   deleteAlbumFromLibrary,
                                   deleteAlbumFromList,
                                   addToListFromSearch,
                                   toggleListDialog
                               }: AlbumCardIconProps) => {

    const saveClickHandler = () => {
        saveAlbum && artist && album && saveAlbum(artist, album)
    }

    const deleteClickHandler = () => {
        if (deleteAlbumFromList) {
            deleteAlbumFromList(albumCardView.id)
        } else if (deleteAlbumFromLibrary) {
            deleteAlbumFromLibrary(albumCardView.id)
        }
    }

    const addToListClickHandler = () => {
        toggleListDialog()
    }

    const addToListHandler = () => {
        addToListFromSearch && artist && album && list && addToListFromSearch(list, artist, album)
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            {(deleteAlbumFromLibrary || deleteAlbumFromList) &&
                <IconButton onClick={deleteClickHandler} sx={{color: saved ? 'red' : 'gray'}}
                            aria-label="unfollow">
                    <DeleteIcon></DeleteIcon>
                </IconButton>}
            {saveAlbum && <IconButton onClick={saveClickHandler}
                                      sx={{color: saved ? (theme) => theme.palette.primary.main : 'gray'}}
                                      aria-label="save">
                <SaveIcon></SaveIcon>
            </IconButton>}
            {addToListFromSearch && <IconButton onClick={addToListHandler}
                                      aria-label="add-to-list">
                <PlaylistAddCheck></PlaylistAddCheck>
            </IconButton>}
            <IconButton onClick={addToListClickHandler}
                        aria-label="add-to-list">
                <PlaylistAdd></PlaylistAdd>
            </IconButton>
            <IconButton component={Link} href={albumCardView?.albumUri}>
                <SvgIcon component={SpotifyIcon} inheritViewBox/>
            </IconButton>
        </Box>
    )
}