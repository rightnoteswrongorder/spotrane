import {Box, IconButton, Link, SvgIcon} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SpotifyIcon from "../../static/images/spotify.svg?react"
import DiscogsIcon from "../../static/images/discogs.svg?react"
import WikipediaIcon from "../../static/images/wikipeida.svg?react"
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

    const makeDiscogsUrl = () => {
        const removeTextInParenthises = albumCardView.name.replace(/ *\([^)]*\) */g, "")
        return `https://www.discogs.com/search/?q=${removeTextInParenthises}&type=master&format=album`
    }

    const makeWikipediaUrl = () => {
        const removeTextInParenthises = albumCardView.name.replace(/ *\([^)]*\) */g, "")
        return `https://en.wikipedia.org/w/index.php?search=${removeTextInParenthises} ${albumCardView.artistName}`
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            {(deleteAlbumFromLibrary || deleteAlbumFromList) &&
                <IconButton onClick={deleteClickHandler} sx={{color: albumCardView.isSaved ? (theme) => theme.palette.secondary.main : 'gray'}}
                            aria-label="unfollow">
                    <DeleteIcon></DeleteIcon>
                </IconButton>}
            {saveAlbum && <IconButton onClick={saveClickHandler}
                                      disabled={albumCardView.isSaved}
                                      aria-label="save">
                <SaveIcon sx={{color: albumCardView.isSaved ? (theme) => theme.palette.primary.main : 'gray'}}></SaveIcon>
            </IconButton>}
            {listVisible && addToVisibleList && <IconButton onClick={addToListHandler}
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
            <IconButton component={Link} target="_blank" href={makeDiscogsUrl()}>
                <SvgIcon component={DiscogsIcon} inheritViewBox/>
            </IconButton>
            <IconButton  component={Link} target="_blank" href={makeWikipediaUrl()}>
                <SvgIcon component={WikipediaIcon} inheritViewBox/>
            </IconButton>
        </Box>
    )
}

export default AlbumCardIcons