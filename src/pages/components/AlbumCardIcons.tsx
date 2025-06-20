import {Avatar, Box, IconButton, Link, SvgIcon, Tooltip} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SpotifyIcon from "../../static/images/spotify.svg?react"
import DiscogsIcon from "../../static/images/discogs.svg?react"
import EcmIcon from "../../static/images/ecmlogo.svg?react"
import {PlaylistAdd, PlaylistAddCheck} from "@mui/icons-material";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";
import React, {useCallback, useEffect, useMemo, useState} from "react";

type AlbumCardIconProps = {
    albumCardView: SpotraneAlbumCard
    listVisible?: boolean
    isOnVisibleList?: boolean
    saveAlbum?: () => void
    deleteAlbumFromLibrary?: () => void
    deleteAlbumFromList?: () => void
    addToVisibleList?: () => void
    toggleListDialog: () => void
}

const AlbumCardIcons = ({
                            albumCardView,
                            listVisible,
                            isOnVisibleList,
                            saveAlbum,
                            deleteAlbumFromLibrary,
                            deleteAlbumFromList,
                            addToVisibleList,
                            toggleListDialog
                        }: AlbumCardIconProps) => {

    const [saved, setSaved] = useState<boolean>(false)

    useEffect(() => {
        if (!saved && albumCardView.isSaved) {
            setSaved(true)
        }
    }, [albumCardView.isSaved, saved]);

    const saveClickHandler = useCallback(() => {
        setSaved(true)
        saveAlbum && saveAlbum()
    }, [saveAlbum]);

    const deleteClickHandler = useCallback(() => {
        if (deleteAlbumFromList) {
            deleteAlbumFromList()
        } else if (deleteAlbumFromLibrary) {
            setSaved(false)
            deleteAlbumFromLibrary()
        }
    }, [deleteAlbumFromList, deleteAlbumFromLibrary]);

    const addToListClickHandler = useCallback(() => {
        toggleListDialog()
    }, [toggleListDialog]);

    const addToListHandler = useCallback(() => {
        addToVisibleList && addToVisibleList()
    }, [addToVisibleList]);

    // Memoize URL generation functions and their results
    const removeTextInParenthises = useCallback((dirtyText: string): string => {
        return dirtyText.replace(/ *\([^)]*\) */g, "")
    }, []);

    const urls = useMemo(() => {
        const cleanAlbumName = removeTextInParenthises(albumCardView.name);

        return {
            discogs: `https://www.discogs.com/search/?q=${cleanAlbumName}&type=master&format=album`,
            wikipedia: `https://en.wikipedia.org/w/index.php?search=${cleanAlbumName} ${albumCardView.artistName}`,
            ecm: `https://ecmreviews.com/?s=${cleanAlbumName}`
        };
    }, [albumCardView.name, albumCardView.artistName, removeTextInParenthises]);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
            {(deleteAlbumFromLibrary || deleteAlbumFromList) &&
                <IconButton onClick={deleteClickHandler}
                            sx={{color: saved ? (theme) => theme.palette.secondary.main : 'gray'}}
                            aria-label="unfollow">
                    <DeleteIcon></DeleteIcon>
                </IconButton>}
            {saveAlbum && <IconButton onClick={saveClickHandler}
                                      disabled={saved}
                                      aria-label="save">
                <SaveIcon sx={{color: saved ? (theme) => theme.palette.primary.main : 'white'}}></SaveIcon>
            </IconButton>}
            {listVisible && addToVisibleList &&
                <IconButton disabled={isOnVisibleList} onClick={addToListHandler}
                            aria-label="add-to-list">
                    <PlaylistAddCheck
                        sx={{color: isOnVisibleList ? (theme) => theme.palette.primary.main : 'white'}}></PlaylistAddCheck>
                </IconButton>}
            <Tooltip title={albumCardView?.appearsOn}>
                <IconButton onClick={addToListClickHandler}
                            aria-label="add-to-list">
                    <PlaylistAdd></PlaylistAdd>
                </IconButton>
            </Tooltip>
            <IconButton component={Link} href={albumCardView?.albumUri}>
                <SvgIcon component={SpotifyIcon} inheritViewBox/>
            </IconButton>
            <IconButton component={Link} target="_blank" href={urls.discogs}>
                <SvgIcon component={DiscogsIcon} inheritViewBox/>
            </IconButton>
            <IconButton component={Link} target="_blank" href={urls.wikipedia}>
                <Avatar sx={{ backgroundColor: 'white', height: '1em', width: '1em', fontFamily: '"Linux Libertine", "Georgia", serif', }}>
                    W
                </Avatar>
            </IconButton>
            {albumCardView.label === "ECM Records" && <IconButton component={Link} target="_blank" href={urls.ecm}>
                <SvgIcon component={EcmIcon} inheritViewBox/>
            </IconButton>}
        </Box>
    )
}

export default React.memo(AlbumCardIcons)