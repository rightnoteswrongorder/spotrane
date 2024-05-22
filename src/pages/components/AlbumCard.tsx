import {useState} from "react";
import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {AlbumCardIcons} from "./AlbumCardIcons.tsx";
import AddToListDialog from "./AddToListDialog.tsx";
import {SpotraneAlbum} from "../../interfaces/SpotraneAlbum.ts";

type AlbumCardProps = {
    album: SpotraneAlbum
    saveAlbum?: (album: SpotraneAlbum) => void
    deleteAlbumFromLibrary?: (albumId: string) => void
    deleteAlbumFromList?: (albumId: string) => void
    addToList?: (album: SpotraneAlbum) => void
}

export const AlbumCard = ({album, saveAlbum, deleteAlbumFromLibrary, deleteAlbumFromList, addToList}: AlbumCardProps) => {
    const [listDialogOpen, setListDialogOpen] = useState<boolean>(false);

    const toggleListDialog = () => {
        setListDialogOpen(!listDialogOpen)
    }

    const handleAddToListDialogClose = () => {
        setListDialogOpen(false)
    }

    return (<Card sx={{height: '175px', display: 'inline-flex'}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flex: '1 0 auto', padding: 0.5}}>
                <Typography noWrap sx={{width: '175px'}} component="div" variant="h6">
                    {`${album?.name}`}
                </Typography>
                <Typography noWrap sx={{width: '175px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.artistName}`}
                </Typography>
                <Typography noWrap sx={{width: '175px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.releaseDate?.substr(0, 4)} ${album?.label}`}
                </Typography>
                <Typography noWrap sx={{width: '175px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.artistGenres}`}
                </Typography>
            </CardContent>
            {album && <AlbumCardIcons album={album} saveAlbum={saveAlbum} deleteAlbumFromLibrary={deleteAlbumFromLibrary} deleteAlbumFromList={deleteAlbumFromList}
                                                addToList={addToList} toggleListDialog={toggleListDialog}/>}
        </Box>
        <CardMedia
            component="img"
            sx={{width: 80, height: 80, padding: 0.5}}
            image={album?.imageUri}
            alt="album cover"
        />
        {listDialogOpen && album?.id &&
            <AddToListDialog isOpen={true} handleAddToListDialogClose={handleAddToListDialogClose}
                             album={album}/>}
    </Card>)
}
