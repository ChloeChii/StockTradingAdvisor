import * as React from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

// Portfolio list item
const PortfolioItem = (props) => {
    const {
        portfolioOnClick = () => { },
        portfolioName = ""
    } = props

    return (
        <Grid item xs={12}>
            <Card
                square
                sx={{
                    boxShadow: "inset 0 -1px 0 0 rgb(100 121 143 / 12%)",
                }}
            >
                <CardActionArea
                    sx={{ px: 4, py: 3 }}
                    onClick={portfolioOnClick}
                >
                    <Typography variant="h4" sx={{ fontSize: 24 }} color="text.primary">
                        {portfolioName}
                    </Typography>
                </CardActionArea>
            </Card>
        </Grid>)
}

export default PortfolioItem;