import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';

const columns = [
    { field: 'symbol', headerName: 'Symbol', width: 130 },
    { field: 'open', headerName: 'Open', width: 130 },
    { field: 'high', headerName: 'High', width: 130 },
    { field: 'low', headerName: 'Low', width: 130 },
    { field: 'close', headerName: 'Close', width: 130 },
    { field: 'adjusted_close', headerName: 'Adjusted Close', width: 150 },
    { field: 'volume', headerName: 'Volume', width: 150 },
    { field: 'date', headerName: 'Date', width: 150}
];

// Data table for display search result
const DataTable = ({stock_json}) => {
    return (
        <div style={{ height: 600, width: "100%" }}>
            <DataGrid
                rows={stock_json}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
            />
        </div>
    );
}

export default DataTable;