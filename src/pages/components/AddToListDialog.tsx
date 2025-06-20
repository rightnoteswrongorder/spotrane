import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import {FormControl} from '@mui/material';
import {Box} from '@mui/material';
import {Tables} from "../../interfaces/database.types.ts";
import {useEffect} from "react";
import {SupabaseApi} from "../../api/supabase.ts";

type AddToListDialogProps = {
    isOpen: boolean
    handleAddToListDialogClose: () => void
    addToList: (listId: number) => void
}

const AddToListDialog = ({isOpen = false, handleAddToListDialogClose, addToList}: AddToListDialogProps) => {

    const [lists, setLists] = React.useState<(Tables<'lists'>[] | null)>([]);
    const [open, setOpen] = React.useState(false);
    const [listName, setListName] = React.useState('');
    const [selectedList, setSelectedList] = React.useState<Tables<'lists'> | undefined | null>();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const getAllLists = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await SupabaseApi.getLists();
            if (data) {
                setLists(data);
            } else {
                setError('Unable to load lists');
            }
        } catch (err) {
            setError('Error loading lists');
            console.error('Failed to load lists:', err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            getAllLists();
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [isOpen]);


    const handleClose = () => {
        setOpen(false);
        handleAddToListDialogClose()
    };

    const handleChange = (event: SelectChangeEvent) => {
        setListName(event.target.value as string);
        setSelectedList(lists?.find(list => list?.name === event.target.value))
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: () => {
                        if(selectedList) {
                            addToList(selectedList.id)
                            handleClose()
                        }
                    },
                }}
            >
                <DialogTitle>Add album to list: </DialogTitle>
                <DialogContent>
                    <Box sx={{minWidth: 120, marginTop: 5}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">List</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={listName}
                                label="List"
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <MenuItem disabled>Loading lists...</MenuItem>
                                ) : error ? (
                                    <MenuItem disabled>{error}</MenuItem>
                                ) : (
                                    lists?.sort((a, b) =>
                                        a.name > b.name ? 1 : -1
                                    ).map(item => {
                                        if (item && item.name) {
                                            return <MenuItem key={item.name}
                                                             value={item.name}>{item.name}</MenuItem>
                                        }
                                    })
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" disabled={isLoading || !!error}>Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AddToListDialog