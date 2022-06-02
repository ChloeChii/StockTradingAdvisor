import Box from '@mui/material/Box';
import * as React from 'react';
import DataTable from '../dataTable/DataTable';

export default function IndividualStockInfo() {
    const [stockJson, setStockJson] = React.useState([]);
    
    
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
