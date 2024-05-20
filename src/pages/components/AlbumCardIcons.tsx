import {useEffect, useState} from "react";
import {deleteAlbum, deleteAlbumFromList, isSaved, saveAlbum} from "../../api/supabase.ts";
import {Box, IconButton, Link, SvgIcon} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SpotifyIcon from "../../static/images/spotify.svg?react"
import {PlaylistAddCheck} from "@mui/icons-material";
import {SpotraneAlbum} from "../../interfaces/SpotraneAlbum.ts";
import {Tables} from "../../interfaces/database.types.ts";

type AlbumCardIconProps = {
    album: SpotraneAlbum
    fromList?: Tables<'lists'>
    toggleListDialog: () => void
}

export const AlbumCardIcons = ({album, fromList, toggleListDialog}: AlbumCardIconProps) => {
    const [savedAlbum, setSavedAlbum] = useState<boolean>(false)

    useEffect(() => {
        // bit of a hack
        isSavedAlbum()
    }, [album, deleteAlbum])

    const isSavedAlbum = () => {
        if (album?.id) {
            isSaved(album?.id).then(res => {
                res ? setSavedAlbum(true) : setSavedAlbum(false)
            })
        }
    }

    const saveClickHandler = () => {
        if (album) {
            saveAlbum(album)
            setSavedAlbum(true)
        }
    }

    const deleteClickHandler = () => {
        if (album) {
            if (fromList) {
                deleteAlbumFromList(fromList, album.id)
            } else {
                deleteAlbum(album)

            }

            setSavedAlbum(false)
        }
    }

    const addToListClickHandler = () => {
        toggleListDialog()
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
            <IconButton onClick={deleteClickHandler} sx={{color: savedAlbum ? 'red' : 'gray'}}
                        aria-label="unfollow">
                <DeleteIcon></DeleteIcon>
            </IconButton>
            <IconButton onClick={saveClickHandler}
                        sx={{color: savedAlbum ? (theme) => theme.palette.primary.main : 'gray'}} aria-label="save">
                <SaveIcon></SaveIcon>
            </IconButton>
            <IconButton onClick={addToListClickHandler}
                        aria-label="add-to-list">
                <PlaylistAddCheck></PlaylistAddCheck>
            </IconButton>
            <IconButton component={Link} href={album?.albumUri}>
                <SvgIcon component={SpotifyIcon} inheritViewBox/>
            </IconButton>
        </Box>
    )
}