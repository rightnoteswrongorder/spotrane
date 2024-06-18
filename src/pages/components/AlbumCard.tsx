import {useState} from "react";
import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";
import AddToListDialog from "./AddToListDialog.tsx";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";
import AlbumCardIcons from "./AlbumCardIcons.tsx";

export type AlbumCardProps = {
    albumCardView: SpotraneAlbumCard
    addToList: (listId: number) => void
    listVisible?: boolean,
    saveAlbum?: () => void
    deleteAlbumFromLibrary?: () => Promise<void>
    deleteAlbumFromList?: () => void
    addToVisibleList?: () => void
}

export const AlbumCard = ({
                              albumCardView,
                              listVisible,
                              saveAlbum,
                              deleteAlbumFromLibrary,
                              deleteAlbumFromList,
                              addToVisibleList,
                              addToList
                          }: AlbumCardProps) => {
    const [listDialogOpen, setListDialogOpen] = useState<boolean>(false);

    const toggleListDialog = () => {
        setListDialogOpen(!listDialogOpen)
    }

    const handleAddToListDialogClose = () => {
        setListDialogOpen(false)
    }

    return (<Card sx={{ padding: 0.6, display: 'inline-flex', boxShadow: 0}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                <CardContent sx={{flex: '1 0 auto', padding: 0.5}}>
                    <Typography noWrap sx={{width: '175px'}} component="div" variant="h6">
                        {`${albumCardView.name}`}
                    </Typography>
                    <Typography noWrap sx={{width: '175px'}} marginTop={0.2} variant="body1" color="text.secondary"
                                component="div">
                        {`${albumCardView.artistName}`}
                    </Typography>
                    <Typography noWrap sx={{width: '175px'}} marginTop={0.2} variant="body1" color="text.secondary"
                                component="div">
                        {`${albumCardView?.releaseDate?.substr(0, 4)} ${albumCardView?.label}`}
                    </Typography>
                    <Typography noWrap sx={{width: '175px'}} marginTop={0.2} variant="body1" color="text.secondary"
                                component="div">
                        {albumCardView.artistGenres.length == 0 ? 'Uknown' : `${albumCardView?.artistGenres}`}
                    </Typography>
                </CardContent>
                <CardMedia
                    component="img"
                    sx={{width: 80, height: 80, padding: 0.5}}
                    image={albumCardView?.imageUri}
                    alt="album cover"
                />
            </Box>
            <AlbumCardIcons albumCardView={albumCardView}
                            listVisible={listVisible}
                            saveAlbum={saveAlbum}
                            deleteAlbumFromLibrary={deleteAlbumFromLibrary}
                            deleteAlbumFromList={deleteAlbumFromList}
                            addToVisibleList={addToVisibleList}
                            toggleListDialog={toggleListDialog}/>
        </Box>
        {
            listDialogOpen &&
            <AddToListDialog isOpen={true} handleAddToListDialogClose={handleAddToListDialogClose}
                             addToList={addToList}/>
        }
    </Card>)
}
