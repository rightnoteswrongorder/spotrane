import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import {FormControl} from '@mui/material';
import {Box} from '@mui/material';
import supabase from "../supabase/supaBaseClient.ts";
import {Tables} from "../interfaces/database.types.ts";
import {useEffect} from "react";

type AddToListDialogProps = {
    isOpen: boolean
    handleAddToListDialogClose: () => void
    handleAdd: (list: Tables<'lists'>, albumId: string) => void
    albumId: string
}

export default function AddToListDialog({isOpen, handleAddToListDialogClose, handleAdd, albumId}: AddToListDialogProps) {

    const [lists, setLists] = React.useState<(Tables<'lists'> | null)[]>([]);
    const [open, setOpen] = React.useState(false);
    const [listName, setListName] = React.useState('');
    const [selectedList, setSelectedList] = React.useState<Tables<'lists'> | undefined | null>();

    const getAllLists = () => {
        (async () => {
            const {data} = await supabase
                .from('lists')
                .select('*')
            const f = data as (Tables<'lists'> | null)[]
            setLists(f)
        })();
    }


    useEffect(() => {
        getAllLists()
        setOpen(isOpen)
    }, []);


    const handleClose = () => {
        setOpen(false);
        handleAddToListDialogClose()
    };

    const handleChange = (event: SelectChangeEvent) => {
        setListName(event.target.value as string);
        setSelectedList(lists.find(list => list?.name === event.target.value))
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        console.log(event)
                        if(selectedList) {
                            handleAdd(selectedList, albumId)
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
                            >
                                {
                                    lists.map(item => {
                                        if (item && item.name) {
                                            return <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                                        }
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
