import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Box, IconButton, Link, SvgIcon} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SpotifyIcon from "../../static/images/spotify.svg?react"
import {PlaylistAddCheck} from "@mui/icons-material";
import {SpotraneAlbum} from "../../interfaces/SpotraneAlbum.ts";
import {Tables} from "../../interfaces/database.types.ts";
import {SupabaseApi} from "../../api/supabase.ts";

type AlbumCardIconProps = {
    album: SpotraneAlbum
    list?: Tables<'lists'>
    listAlbums?: SpotraneAlbum[]
    setListAlbums?: Dispatch<SetStateAction<SpotraneAlbum[]>>
    toggleListDialog: () => void
}

export const AlbumCardIcons = ({album, list, listAlbums, setListAlbums, toggleListDialog}: AlbumCardIconProps) => {
    const [savedAlbum, setSavedAlbum] = useState<boolean>(false)

    useEffect(() => {
        // bit of a hack
        isSavedAlbum()
    }, [album, SupabaseApi.deleteAlbum])

    const isSavedAlbum = () => {
        SupabaseApi.isSaved(album?.id).then(res => {
            res ? setSavedAlbum(true) : setSavedAlbum(false)
        })
    }

    const saveClickHandler = () => {
        SupabaseApi.saveAlbum(album)
        setSavedAlbum(true)
    }

    const deleteClickHandler = () => {
        if (list) {
            SupabaseApi.deleteAlbumFromList(list, album.id)
            const newListIds = listAlbums?.filter(listAlbums => listAlbums.id != album.id)
            if (setListAlbums && newListIds) {
                setListAlbums(newListIds)
            }
        } else {
            SupabaseApi.deleteAlbum(album)
        }
        setSavedAlbum(false)
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