import {Box, IconButton, Link, SvgIcon} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SpotifyIcon from "../../static/images/spotify.svg?react"
import {PlaylistAdd, PlaylistAddCheck} from "@mui/icons-material";
import {SpotraneAlbumCardView} from "../../interfaces/SpotraneTypes.ts";

type AlbumCardIconProps = {
    albumCardView: SpotraneAlbumCardView
    saveAlbum?: () => void
    deleteAlbumFromLibrary?: (albumId: string) => void
    deleteAlbumFromList?: (albumId: string) => void
    addToVisibleList?: () => void
    toggleListDialog: () => void
}

export const AlbumCardIcons = ({
                                   albumCardView,
                                   saveAlbum,
                                   deleteAlbumFromLibrary,
                                   deleteAlbumFromList,
                                   addToVisibleList,
                                   toggleListDialog
                               }: AlbumCardIconProps) => {

    const saveClickHandler = () => {
        saveAlbum && saveAlbum()
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
        addToVisibleList && addToVisibleList()
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            {(deleteAlbumFromLibrary || deleteAlbumFromList) &&
                <IconButton onClick={deleteClickHandler} sx={{color: albumCardView.isSaved ? 'red' : 'gray'}}
                            aria-label="unfollow">
                    <DeleteIcon></DeleteIcon>
                </IconButton>}
            {saveAlbum && <IconButton onClick={saveClickHandler}
                                      sx={{color: albumCardView.isSaved ? (theme) => theme.palette.primary.main : 'gray'}}
                                      aria-label="save">
                <SaveIcon></SaveIcon>
            </IconButton>}
            {addToVisibleList && <IconButton onClick={addToListHandler}
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