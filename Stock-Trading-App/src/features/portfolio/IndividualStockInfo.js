import Box from '@mui/material/Box';
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
