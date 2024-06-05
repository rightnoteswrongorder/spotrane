import {Box, IconButton, Link, SvgIcon} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SpotifyIcon from "../../static/images/spotify.svg?react"
import {PlaylistAdd, PlaylistAddCheck} from "@mui/icons-material";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";

type AlbumCardIconProps = {
    albumCardView: SpotraneAlbumCard
    listVisible?: boolean
    saveAlbum?: () => void
    deleteAlbumFromLibrary?: () => void
    deleteAlbumFromList?: () => void
    addToVisibleList?: () => void
    toggleListDialog: () => void
}

const AlbumCardIcons = ({
                                   albumCardView,
                                   listVisible,
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
            deleteAlbumFromList()
        } else if (deleteAlbumFromLibrary) {
            deleteAlbumFromLibrary()
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
                <IconButton onClick={deleteClickHandler} sx={{paddingTop: 0, paddingLeft: 0, color: albumCardView.isSaved ? (theme) => theme.palette.secondary.main : 'gray'}}
                            aria-label="unfollow">
                    <DeleteIcon></DeleteIcon>
                </IconButton>}
            {saveAlbum && <IconButton onClick={saveClickHandler}
                                      sx={{paddingTop: 0, color: albumCardView.isSaved ? (theme) => theme.palette.primary.main : 'gray'}}
                                      aria-label="save">
                <SaveIcon></SaveIcon>
            </IconButton>}
            {listVisible && addToVisibleList && <IconButton sx={{paddingTop: 0}} onClick={addToListHandler}
                                      aria-label="add-to-list">
                <PlaylistAddCheck></PlaylistAddCheck>
            </IconButton>}
            <IconButton sx={{paddingTop: 0}} onClick={addToListClickHandler}
                        aria-label="add-to-list">
                <PlaylistAdd></PlaylistAdd>
            </IconButton>
            <IconButton sx={{paddingTop: 0}} component={Link} href={albumCardView?.albumUri}>
                <SvgIcon component={SpotifyIcon} inheritViewBox/>
            </IconButton>
        </Box>
    )
}

export default AlbumCardIcons