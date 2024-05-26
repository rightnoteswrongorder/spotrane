import {useState} from "react";
import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {AlbumCardIcons} from "./AlbumCardIcons.tsx";
import AddToListDialog from "./AddToListDialog.tsx";
import {SpotraneAlbumCardView} from "../../interfaces/SpotraneTypes.ts";
import {Tables} from "../../interfaces/database.types.ts";

type AlbumCardProps = {
    albumCardView: SpotraneAlbumCardView
    saveAlbum?: () => void
    deleteAlbumFromLibrary?: (albumId: string) => void
    deleteAlbumFromList?: (albumId: string) => void
    addToVisibleList?: () => void
    addToList: (list: Tables<'lists'>) => void
}

export const AlbumCard = ({
                              albumCardView,
                              saveAlbum,
                              deleteAlbumFromLibrary,
                              deleteAlbumFromList,
                              addToVisibleList,
                              addToList
                          }: AlbumCardProps) => {
    const [listDialogOpen, setListDialogOpen] = useState<boolean>(false);

    const toggleListDialog = () => {
        console.log(!listDialogOpen)
        setListDialogOpen(!listDialogOpen)
    }

    const handleAddToListDialogClose = () => {
        setListDialogOpen(false)
    }

    return (<Card sx={{height: '175px', display: 'inline-flex'}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flex: '1 0 auto', padding: 0.5}}>
                <Typography noWrap sx={{width: '175px'}} component="div" variant="h6">
                    {`${albumCardView.name}`}
                </Typography>
                <Typography noWrap sx={{width: '175px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${albumCardView.artistName}`}
                </Typography>
                <Typography noWrap sx={{width: '175px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${albumCardView?.releaseDate?.substr(0, 4)} ${albumCardView?.label}`}
                </Typography>
                <Typography noWrap sx={{width: '175px'}} variant="subtitle1" color="text.secondary" component="div">
                    {`${albumCardView?.artistGenres}`}
                </Typography>
            </CardContent>
            <AlbumCardIcons albumCardView={albumCardView}
                            saveAlbum={saveAlbum}
                            deleteAlbumFromLibrary={deleteAlbumFromLibrary}
                            deleteAlbumFromList={deleteAlbumFromList}
                            addToVisibleList={addToVisibleList}
                            toggleListDialog={toggleListDialog}/>
        </Box>
        <CardMedia
            component="img"
            sx={{width: 80, height: 80, padding: 0.5}}
            image={albumCardView?.imageUri}
            alt="album cover"
        />
        {listDialogOpen &&
            <AddToListDialog isOpen={true} handleAddToListDialogClose={handleAddToListDialogClose}
                             addToList={addToList}/>}
    </Card>)
}
