import {Box, IconButton} from "@mui/material";
import {StarRateOutlined} from "@mui/icons-material";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";
import React, {useCallback, useState} from "react";

type AlbumCardStarsProps<T> = {
    updateRating?: (rating: number) => void
    albums?: T[]
    album: SpotraneAlbumCard
}

const AlbumCardStars = <T, >({updateRating, album}: AlbumCardStarsProps<T>) => {
    const [currentlyHovered, setCurrentlyHovered] = useState<number>(0)

    const ratingClickHandler = useCallback((rating: number) => {
        album.rating = rating;
        updateRating && updateRating(rating)
    }, [album, updateRating]);

    const mouseEnter = useCallback((star: number) => {
        setCurrentlyHovered(star)
    }, []);

    const mouseLeave = useCallback(() => {
        setCurrentlyHovered(0)
    }, []);

    // Use memoized handlers for each star to avoid bind calls
    const starButtons = React.useMemo(() => {
        return [...Array(5)].map((_, i) => {
            const handleClick = () => ratingClickHandler(i + 1);
            const handleMouseEnter = () => mouseEnter(i + 1);

            return (
                <IconButton 
                    disableFocusRipple 
                    disableRipple 
                    disableTouchRipple
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={mouseLeave}
                    key={i}
                    aria-label="rate-star">
                    <StarRateOutlined
                        sx={{fill: album.rating > i || currentlyHovered > i ? 'gold' : ''}}
                    />
                </IconButton>
            );
        });
    }, [album.rating, currentlyHovered, mouseEnter, mouseLeave, ratingClickHandler]);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
            {starButtons}
        </Box>
    )
}

export default React.memo(AlbumCardStars)