import * as React from 'react';
import {ChangeEvent, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Box, DialogContentText, FormControl, TextField} from '@mui/material';

type YesNoDialogProps = {
    title: string
    subTitle: string
    label: string
    confirmButtonLabel: string
    isOpen: boolean
    confirmEnabled: (data: string) => boolean
    handleSubmit: (data: string) => void
    handleClose: () => void
}

const CreateListDialog = ({
                              title,
                              subTitle,
                              label,
                              confirmEnabled,
                              confirmButtonLabel,
                              isOpen,
                              handleSubmit,
                              handleClose
                          }: YesNoDialogProps) => {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(isOpen)
    }, [])


    const handleDialogClose = () => {
        setOpen(false);
        handleClose()
    }

    const [enableConfirm, setEnableConfirm] = useState(false)

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        handleSubmit(formData.get(label) as string)
                        handleDialogClose();
                    },
                }}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Box sx={{minWidth: 120}}>
                        <FormControl fullWidth>
                            <DialogContentText>
                                {subTitle}
                            </DialogContentText>
                            <TextField
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                                    event.preventDefault();
                                    setEnableConfirm(confirmEnabled(event.target.value))
                                }}
                                autoFocus
                                required
                                margin="dense"
                                id="data"
                                name={label}
                                label={label}
                                fullWidth
                                variant="standard"
                            /> </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button disabled={!enableConfirm} type="submit">{confirmButtonLabel}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default CreateListDialog