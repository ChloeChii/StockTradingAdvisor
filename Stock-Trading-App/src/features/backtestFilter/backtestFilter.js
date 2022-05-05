import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import * as React from 'react';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ffffff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // margin: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
}));


export default function BacktestFilter(props) {

    const {
        filterList,
        itemIndex,
        handleConditionChange,
        conditionItem,
        removeItem,
    } = props

    // Handle the state change
    const handleStateChange = (event, stateName) => {
        // Copy the current state
        let newCond = { ...conditionItem };
        // Modify the value
        newCond[stateName] = event.target.value;
        // Pass the new state back
        handleConditionChange(itemIndex, newCond);
    };

    return (
        <Item>
            <Grid
                container
                item
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                xs={12}
                sx={{ padding: 2 }}
            >
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{ padding: 6, fontSize: '20px' }}
                >
                    {
                        conditionItem.isAdvanced == false ?
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Filter Name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={conditionItem.filterIdx}
                                    label="Filter Name"
                                    name="Filter Name"
                                    onChange={(e) => {
                                        handleStateChange(e, "filterIdx")
                                    }}
                                >
                                    {filterList.map((filter) =>
                                        <MenuItem
                                            key={filter['id']}
                                            value={filter['id']}
                                        >
                                            {filter['filter_name']}
                                        </MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                            :
                            <TextField
                                disabled
                                id="standard-disabled"
                                label="Date"
                                variant="outlined"
                                value={conditionItem.formula}
                                onChange={(e) => {
                                    handleStateChange(e, "formula")
                                }}
                                fullWidth
                            />
                    }

                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    md={7}
                >
                    {
                        (conditionItem.filterIdx > 1 || conditionItem.isAdvanced)
                        &&
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            style={{ padding: 6 }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Comparator</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={conditionItem.comparison}
                                    label="Comparator"
                                    name="Comparator"
                                    onChange={(e) => {
                                        handleStateChange(e, "comparison")
                                    }}
                                >
                                    <MenuItem value={10}>greater than</MenuItem>
                                    <MenuItem value={20}>less than</MenuItem>
                                    <MenuItem value={30}>equal to</MenuItem>
                                    <MenuItem value={40}>between</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    }
                    {
                        (conditionItem.filterIdx > 1 || conditionItem.isAdvanced)
                        &&
                        <Grid
                            container
                            item
                            xs={12}
                            sm={3}
                            md={3}
                            justifyContent="flex-start"
                            style={{ padding: 6 }}
                        >
                            <TextField
                                id="standard-basic-value1"
                                label="Date"
                                variant="outlined"
                                fullWidth
                                value={conditionItem.value1}
                                onChange={(e) => {
                                    handleStateChange(e, "value1")
                                }}
                            />
                        </Grid>
                    }
                    {/*
                    {
                        (conditionItem.filterIdx > 1 || conditionItem.isAdvanced)
                        &&
                        <Grid
                            container
                            item
                            xs={12}
                            sm={3}
                            md={3}
                            justifyContent="flex-start"
                            style={{ padding: 6 }}
                        >
                            <TextField
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Date"
                                variant="outlined"
                                fullWidth
                                value={conditionItem.date1}
                                onChange={(e) => {
                                    handleStateChange(e, "date1")
                                }}
                            />
                        </Grid>
                    }
                */}
                    {
                        conditionItem.comparison === 40
                        &&
                        <Grid
                            container
                            item
                            xs={12}
                            sm={3}
                            md={3}
                            justifyContent="flex-start"
                            style={{ padding: 6 }}
                        >
                            <TextField
                                id="standard-basic-value2"
                                label="Date"
                                variant="outlined"
                                fullWidth
                                value={conditionItem.value2}
                                onChange={(e) => {
                                    handleStateChange(e, "value2")
                                }}
                            />
                        </Grid>
                    }
                </Grid>
                <Grid
                    item
                    container
                    justifyContent="flex-end"
                    md={1}
                    sx={{
                        mt: {
                            xs: 2,
                            lg: 0
                        }
                    }}
                >
                    <IconButton onClick={() => { removeItem(conditionItem.id) }}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Item>
    );
}


