import Grid from "@mui/material/Grid";
import {Tables} from "../interfaces/database.types";
import {SupabaseApi} from "../api/supabase";
import {useEffect, useState} from "react";
import {
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Autocomplete, Typography
} from "@mui/material";
import Button from "@mui/material/Button";

const Discogs = () => {
    const [albums, setAlbums] = useState<Tables<'bluenote_rvg_seventies'>[]>([]);
    const [blueNoteAlbums, setBlueNoteAlbums] = useState<Tables<'bluenote_rvg_seventies'>[]>([]);
    const [impulseAlbums, setImpulseAlbums] = useState<Tables<'impulse_rvg'>[]>([]);
    const [ctiAlbums, setCtiAlbums] = useState<Tables<'cti_rvg'>[]>([]);
    const [filtered, setFiltered] = useState<typeof albums>([]);

    const [artistFilter, setArtistFilter] = useState('');
    const [titleFilter, setTitleFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    useEffect(() => {
        (async () => {
            const blueNoteData = await SupabaseApi.getRvgSeventiesBlueNotes();
            const impulseData = await SupabaseApi.getRvgImpulse();
            const ctiData = await SupabaseApi.getCtiImpulse();
            setBlueNoteAlbums(blueNoteData);
            setImpulseAlbums(impulseData);
            setCtiAlbums(ctiData);
        })();
    }, []);

    useEffect(() => {
        const filteredData = albums.filter(item => {
            return (
                (!artistFilter || item.artist?.toLowerCase().includes(artistFilter.toLowerCase())) &&
                (!titleFilter || item.title?.toLowerCase().includes(titleFilter.toLowerCase())) &&
                (!yearFilter || String(item.year).includes(yearFilter))
            );
        });
        setFiltered(filteredData);
    }, [artistFilter, titleFilter, yearFilter, albums]);

    const getUniqueValues = (key: keyof Tables<'bluenote_rvg_seventies'>) => {
        return Array.from(new Set(albums.map(item => item[key]).filter(Boolean))).sort();
    };

    const setCorrectData = (name : string) => {
        if(name === 'Blue Note 70s') {
            setAlbums(blueNoteAlbums)
        } else if (name === 'Impulse') {
            setAlbums(impulseAlbums)
        } else if(name === 'CTI') {
            setAlbums(ctiAlbums)
        }
    }

    return (
        <Grid container spacing={2} padding={1}>
            <Grid item xs={12} md={2.4}>
                <Autocomplete
                    freeSolo
                    options={['Blue Note 70s', 'Impulse', 'CTI']}
                    onInputChange={(_, value) => setCorrectData(value)}
                    renderInput={(params) => <TextField {...params} label="Artist" variant="outlined" />}
                />
            </Grid>
            <Grid item xs={12} md={2.4}>
                <Autocomplete
                    freeSolo
                    options={getUniqueValues('artist') as string[]}
                    onInputChange={(_, value) => setArtistFilter(value)}
                    renderInput={(params) => <TextField {...params} label="Artist" variant="outlined" />}
                />
            </Grid>
            <Grid item xs={12} md={2.4}>
                <Autocomplete
                    freeSolo
                    options={getUniqueValues('title') as string[]}
                    onInputChange={(_, value) => setTitleFilter(value)}
                    renderInput={(params) => <TextField {...params} label="Title" variant="outlined" />}
                />
            </Grid>
            <Grid item xs={12} md={2.4}>
                <Autocomplete
                    freeSolo
                    options={getUniqueValues('year').map(String)}
                    onInputChange={(_, value) => setYearFilter(value)}
                    renderInput={(params) => <TextField {...params} label="Year" variant="outlined" />}
                />
            </Grid>

            <Grid item xs={12} md={2.4}>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{height: '100%'}}
                    color="primary"
                    onClick={() => {
                        filtered.forEach((row) => {
                            if (row.marketplace) {
                                window.open(row.marketplace, '_blank');
                            }
                        });
                    }}
                >
                    Open All Links
                </Button>
            {/*<Grid item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>*/}
            {/*    <Button*/}
            {/*        variant="contained"*/}
            {/*        color="primary"*/}
            {/*        onClick={() => {*/}
            {/*            filtered.forEach((row) => {*/}
            {/*                if (row.marketplace) {*/}
            {/*                    window.open(row.marketplace, '_blank');*/}
            {/*                }*/}
            {/*            });*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        Open All Links*/}
            {/*    </Button>*/}
            </Grid>

            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Artist</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Year</TableCell>
                                {/*<TableCell>Match</TableCell>*/}
                                <TableCell>Links</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((row, idx) => (
                                <TableRow key={idx}>
                                    {/*noWrap style={{ maxWidth: 800}}*/}
                                    <TableCell ><Typography>{row.artist}</Typography></TableCell>
                                    <TableCell sx={{whiteSpace: 'nowrap'}}>{row.title}</TableCell>
                                    <TableCell>{row.year}</TableCell>
                                    {/*<TableCell>{row.match}</TableCell>*/}
                                    <TableCell>
                                        <a href={row.url} target="_blank" rel="noopener noreferrer">Release</a>
                                        {" | "}
                                        <a href={row.marketplace || ""} target="_blank" rel="noopener noreferrer">Marketplace</a>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No results</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default Discogs;
