import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';

// Dialog component for create portfolio and add new stock
const NewDialog = (props) => {
    const {
        open = false,
        setOpen = () => { },
        dialogTitle = "",
        inputLabel = "Name",
        newName = "",
        setNewName = () => { },
        createOnClick = () => { }
        //searchOnClick = () => { }
    } = props;

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth={"xs"}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id={inputLabel}
                        label={inputLabel}
                        type="text"
                        fullWidth
                        value={newName}
                        onChange={(event) => {
                            setNewName(event.target.value);
                        }}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    {/* <Button 
                        onClick={() => { 
                            searchOnClick();
                            setOpen(false);
                        }}
                    >Search</Button> */}
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            createOnClick();
                            setOpen(false);
                        }}
                        variant="outlined"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NewDialog;