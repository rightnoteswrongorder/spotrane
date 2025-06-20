import {Box, IconButton} from "@mui/material";
import {StarRateOutlined} from "@mui/icons-material";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";
import React, {useCallback, useState} from "react";

type AlbumCardStarsProps = {
    updateRating?: (rating: number) => void
    album: SpotraneAlbumCard
}

const AlbumCardStars = ({updateRating = undefined, album}: AlbumCardStarsProps) => {
    const [currentlyHovered, setCurrentlyHovered] = useState<number>(0);
    // Track if a rating update is in progress to prevent multiple rapid clicks
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const ratingClickHandler = useCallback((rating: number) => {
        if (isUpdating) return; // Prevent multiple rapid clicks

        setIsUpdating(true);
        // Update local state immediately for responsive UI
        const previousRating = album.rating;
        album.rating = rating;

        // Update backend
        if (updateRating) {
            Promise.resolve(updateRating(rating))
                .catch(() => {
                    // Revert on error
                    album.rating = previousRating;
                })
                .finally(() => {
                    setIsUpdating(false);
                });
        } else {
            setIsUpdating(false);
        }
    }, [album, updateRating, isUpdating]);

    const mouseEnter = useCallback((star: number) => {
        setCurrentlyHovered(star)
    }, []);

    const mouseLeave = useCallback(() => {
        setCurrentlyHovered(0)
    }, []);

    // Use memoized handlers for each star to avoid bind calls
    const starButtons = React.useMemo(() => {
        // Create an array of exactly 5 elements
        const stars = Array(5).fill(null);

        return stars.map((_, i) => {
            const starIndex = i; // Use a local constant to avoid closure issues
            const handleClick = () => ratingClickHandler(starIndex + 1);
            const handleMouseEnter = () => mouseEnter(starIndex + 1);
            const isFilled = (album.rating ?? 0) > starIndex || currentlyHovered > starIndex;

            return (
                <IconButton 
                    disableFocusRipple 
                    disableRipple 
                    disableTouchRipple
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={mouseLeave}
                    key={starIndex}
                    size="small"
                    aria-label={`Rate ${starIndex + 1} star`}>
                    <StarRateOutlined
                        sx={{fill: isFilled ? 'gold' : ''}}
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

export default React.memo(AlbumCardStars);