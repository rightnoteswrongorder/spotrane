import {Dispatch, SetStateAction, useState} from "react";
import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {AlbumCardIcons} from "./AlbumCardIcons.tsx";
import AddToListDialog from "./AddToListDialog.tsx";
import {SpotraneAlbum} from "../../interfaces/SpotraneAlbum.ts";
import {Tables} from "../../interfaces/database.types.ts";

type AlbumCardProps = {
    simplifiedAlbum: SpotraneAlbum
    list?: Tables<'lists'>
    listAlbums?: SpotraneAlbum[]
    setListAlbums?: Dispatch<SetStateAction<SpotraneAlbum[]>>
}

export const AlbumCard = ({simplifiedAlbum, list, listAlbums, setListAlbums}: AlbumCardProps) => {
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
                    {`${simplifiedAlbum?.name}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${simplifiedAlbum?.artistName}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${simplifiedAlbum?.releaseDate?.substr(0, 4)} ${simplifiedAlbum?.label}`}
                </Typography>
                <Typography noWrap sx={{width: '200px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${simplifiedAlbum?.artistGenres}`}
                </Typography>
            </CardContent>
            {simplifiedAlbum && <AlbumCardIcons album={simplifiedAlbum} list={list} listAlbums={listAlbums} setListAlbums={setListAlbums} toggleListDialog={toggleListDialog}/>}
        </Box>
        <CardMedia
            component="img"
            sx={{width: 100, height: 100}}
            image={simplifiedAlbum?.imageUri}
            alt="album cover"
        />
        {listDialogOpen && simplifiedAlbum?.id &&
            <AddToListDialog isOpen={true} handleAddToListDialogClose={handleAddToListDialogClose}
                             albumId={simplifiedAlbum.id}/>}
    </Card>)
}
