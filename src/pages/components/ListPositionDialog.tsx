import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {TextField} from '@mui/material';
import {FormControl} from '@mui/material';
import {Box} from '@mui/material';
import {ChangeEvent, useEffect} from "react";
import {SupabaseApi} from "../../api/supabase.ts";
import {number} from "yup";

type ListPositionDialogProps = {
    isOpen: boolean
    listEntryId: number
    currentPosition: number
    handleListPositionClose: () => void
}

const ListPositionDialog = ({isOpen, listEntryId, currentPosition, handleListPositionClose}: ListPositionDialogProps) => {

    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState<number>();

    useEffect(() => {
        setOpen(isOpen)
    }, []);


    const handleClose = () => {
        setOpen(false);
        handleListPositionClose()
    };


    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: () => {
                        val && SupabaseApi.updateListEntryPriority(listEntryId, val)
                            handleClose()
                    },
                }}
            >
                <DialogTitle>Set Position: </DialogTitle>
                <DialogContent>
                    <Box sx={{minWidth: 120}}>
                        <FormControl fullWidth>
                            <TextField
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                                    setVal(parseInt(event.target.value))
                                    event.preventDefault();
                                }}
                                inputProps={{type: number}}
                                autoFocus
                                required
                                margin="dense"
                                id="data"
                                name={"Position"}
                                label={"Position..."}
                                fullWidth
                                variant="standard"
                            />
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

export default ListPositionDialog