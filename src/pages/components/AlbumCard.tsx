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
}

export const AlbumCard = ({album, saveAlbum, deleteAlbumFromLibrary, deleteAlbumFromList}: AlbumCardProps) => {
    const [listDialogOpen, setListDialogOpen] = useState<boolean>(false);

    const toggleListDialog = () => {
        setListDialogOpen(!listDialogOpen)
    }

    const handleAddToListDialogClose = () => {
        setListDialogOpen(false)
    }

    return (<Card sx={{width: '350px', height: '200px', display: 'inline-flex'}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flex: '1 0 auto'}}>
                <Typography noWrap sx={{width: '200px'}} component="div" variant="h6">
                    {`${album?.name}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.artistName}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.releaseDate?.substr(0, 4)} ${album?.label}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${album?.artistGenres}`}
                </Typography>
            </CardContent>
            {album && <AlbumCardIcons album={album} saveAlbum={saveAlbum} deleteAlbumFromLibrary={deleteAlbumFromLibrary} deleteAlbumFromList={deleteAlbumFromList}
                                                toggleListDialog={toggleListDialog}/>}
        </Box>
        <CardMedia
            component="img"
            sx={{width: 100, height: 100}}
            image={album?.imageUri}
            alt="album cover"
        />
        {listDialogOpen && album?.id &&
            <AddToListDialog isOpen={true} handleAddToListDialogClose={handleAddToListDialogClose}
                             albumId={album.id}/>}
    </Card>)
}
