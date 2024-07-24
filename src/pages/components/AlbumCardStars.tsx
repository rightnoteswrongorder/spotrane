import {Box, IconButton} from "@mui/material";
import {StarRateOutlined} from "@mui/icons-material";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";

type AlbumCardStarsProps<T> = {
    updateRating?: (rating: number, albums: T[]) => void
    albums?: T[]
    album: SpotraneAlbumCard
}

const AlbumCardStars = <T, >({updateRating, albums, album}: AlbumCardStarsProps<T>) => {
    const ratingClickHandler = (rating: number) => {
        updateRating && albums && updateRating(rating, albums)
    }

    return (
        <Box  sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
            {[...Array(5)].map((_, i) => (
                <IconButton disableFocusRipple disableRipple disableTouchRipple
                            onClick={ratingClickHandler.bind(this, i + 1)}
                            key={i}
                            aria-label="">
                    <StarRateOutlined
                        sx={{fill: album.rating > i ? 'gold' : '', "&:hover": {color: 'gold'}}}></StarRateOutlined>
                </IconButton>
            ))}
        </Box>
    )
}

export default AlbumCardStars