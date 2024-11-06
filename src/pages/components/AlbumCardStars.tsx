import {Box, IconButton} from "@mui/material";
import {StarRateOutlined} from "@mui/icons-material";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";
import {useState} from "react";

type AlbumCardStarsProps<T> = {
    updateRating?: (rating: number) => void
    albums?: T[]
    album: SpotraneAlbumCard
}

const AlbumCardStars = <T, >({updateRating, album}: AlbumCardStarsProps<T>) => {
    const [currentlyHovered, setCurrentlyHovered] = useState<number>(0)

    const ratingClickHandler = (rating: number) => {
        album.rating = rating;
        updateRating && updateRating(rating)
    }

   const mouseEnter = (star: number) => {
        setCurrentlyHovered(star)
    }

    const mouseLeave = () => {
        setCurrentlyHovered(0)
    }

    return (
        <Box  sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
            {[...Array(5)].map((_, i) => (
                <IconButton disableFocusRipple disableRipple disableTouchRipple
                            onClick={ratingClickHandler.bind(this, i + 1)}
                            onMouseEnter={mouseEnter.bind(this,i+1)}
                            onMouseLeave={mouseLeave}
                            key={i}
                            aria-label="">
                    <StarRateOutlined
                        sx={{fill: album.rating > i || currentlyHovered > i ? 'gold' : ''}}></StarRateOutlined>
                </IconButton>
            ))}
        </Box>
    )
}

export default AlbumCardStars