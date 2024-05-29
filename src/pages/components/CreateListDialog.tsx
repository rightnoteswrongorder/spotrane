import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {DialogContentText, TextField} from '@mui/material';
import {FormControl} from '@mui/material';
import {Box} from '@mui/material';
import {useEffect} from "react";
import {SupabaseApi} from "../../api/supabase.ts";

type AddToListDialogProps = {
    isOpen: boolean
    handleAddToListDialogClose: () => void
}

const CreateListDialog = ({isOpen, handleAddToListDialogClose}: AddToListDialogProps) => {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(isOpen)
    }, [])


    const handleClose = () => {
        setOpen(false);
        handleAddToListDialogClose();
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        SupabaseApi.createList(formData.get('listName') as string)
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Create list: </DialogTitle>
                <DialogContent>
                    <Box sx={{minWidth: 120}}>
                        <FormControl fullWidth>
                            <DialogContentText>
                                Create a new list - requires a unique name...
                            </DialogContentText>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="listName"
                                label="List Name"
                                fullWidth
                                variant="standard"
                            />                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default CreateListDialog