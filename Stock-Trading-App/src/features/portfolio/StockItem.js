import * as React from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Fade from '@mui/material/Fade';

// Stock list item
const StockItem = (props) => {

    const [shouldRaised, setRaised] = React.useState(false);
    const {
        removeOnClick = () => { },
        stockName = ""
    } = props

    return (
        <Grid item xs={12}>
            <Card
                square
                raised={shouldRaised}
                onMouseEnter={() => {
                    setRaised(true);
                }}
                onMouseLeave={() => {
                    setRaised(false);
                }}
                sx={{
                    px: 4,
                    py: 2,
                }}
            >
                <Grid
                    container
                    alignItems="center"
                >
                    <Grid
                        item
                        sx={{
                            flexGrow: 1
                        }}
                    >
                        <Typography variant="h4" sx={{ fontSize: 24 }} color="text.primary">
                            {stockName}
                        </Typography>
                    </Grid>
                    <Fade in={shouldRaised}>
                        <Grid
                            item
                        >
                            <IconButton aria-label="delete" size="large" onClick={removeOnClick}>
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </Grid>
                    </Fade>
                </Grid>
            </Card>
        </Grid>)
}

export default StockItem;