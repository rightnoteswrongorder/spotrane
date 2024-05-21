import {Box, IconButton, Link, SvgIcon} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SpotifyIcon from "../../static/images/spotify.svg?react"
import {PlaylistAddCheck} from "@mui/icons-material";
import {SpotraneAlbum} from "../../interfaces/SpotraneAlbum.ts";

type AlbumCardIconProps = {
    album: SpotraneAlbum
    saveAlbum?: (album: SpotraneAlbum) => void
    deleteAlbumFromLibrary?: (albumId: string) => void
    deleteAlbumFromList?: (albumId: string) => void
    toggleListDialog: () => void
}

export const AlbumCardIcons = ({album, saveAlbum, deleteAlbumFromLibrary, deleteAlbumFromList, toggleListDialog}: AlbumCardIconProps) => {

    const saveClickHandler = () => {
        saveAlbum && saveAlbum(album)
    }

    const deleteClickHandler = () => {
        if (deleteAlbumFromList) {
            deleteAlbumFromList(album.id)
        } else if(deleteAlbumFromLibrary) {
            deleteAlbumFromLibrary(album.id)
        }
    }

    const addToListClickHandler = () => {
        toggleListDialog()
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
            {(deleteAlbumFromLibrary || deleteAlbumFromList) && <IconButton onClick={deleteClickHandler} sx={{color: album.saved ? 'red' : 'gray'}}
                        aria-label="unfollow">
                <DeleteIcon></DeleteIcon>
            </IconButton>}
            {saveAlbum && <IconButton onClick={saveClickHandler}
                        sx={{color: album.saved ? (theme) => theme.palette.primary.main : 'gray'}} aria-label="save">
                <SaveIcon></SaveIcon>
            </IconButton>}
            {!saveAlbum && <IconButton onClick={addToListClickHandler}
                        aria-label="add-to-list">
                <PlaylistAddCheck></PlaylistAddCheck>
            </IconButton>}
            <IconButton component={Link} href={album?.albumUri}>
                <SvgIcon component={SpotifyIcon} inheritViewBox/>
            </IconButton>
        </Box>
    )
}