import * as React from 'react';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

// Portfolio operation bar
const PortfolioBar = (props) => {
    const {
        newButtonClick = () => { },
        title = "Portfolios",
        newItemText = "Create",
    } = props;

    return (
        <Paper variant="outlined" sx={{ px: 4, py: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: "center" }}>
                        <Typography variant="h4" sx={{ fontSize: 24 }} color="text.primary">
                            {title}
                        </Typography>
                    </Box>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={newButtonClick}>
                        {newItemText}
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}

export default PortfolioBar;