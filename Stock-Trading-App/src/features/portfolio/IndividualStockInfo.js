import Box from '@mui/material/Box';
import * as React from 'react';
import DataTable from '../dataTable/DataTable';

const IndividualStockInfo = ({stockJson}) => {
    
    return (
        <>
            <Box
                sx={{
                    my: 5,
                }}
            >
                <DataTable stock_json={stockJson} />
            </Box>
        </>
    )
}

export default IndividualStockInfo;
