import {Box, IconButton} from "@mui/material";
import {StarRateOutlined} from "@mui/icons-material";
import {SupabaseApi} from "../../api/supabase.ts";
import {SpotraneAlbumCard} from "../../interfaces/spotrane.types.ts";

type AlbumCardStarsProps = {
    album: SpotraneAlbumCard
}

const AlbumCardStars = ({album}: AlbumCardStarsProps) => {

    const ratingClickHandler = (rating: number) => {
        SupabaseApi.setRating(rating, album.id);
    }

    return (
        <Box sx={{display: 'flex', 'flex-wrap': 'wrap', alignItems: 'center'}}>
            {[...Array(5)].map((_, i) => (
                <IconButton disableFocusRipple disableRipple disableTouchRipple onClick={ratingClickHandler.bind(this, i+1)}
                            aria-label="">
                    <StarRateOutlined sx={{fill: album.rating > i ? 'gold' : '', "&:hover": {color: 'gold'}}}></StarRateOutlined>
                </IconButton>
            ))}
        </Box>
    )
}

export default AlbumCardStars