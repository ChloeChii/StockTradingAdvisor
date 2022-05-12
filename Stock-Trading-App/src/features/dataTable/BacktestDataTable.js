import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';

const columns = [
    { field: 'symbol', headerName: 'Symbol', width: 110 },
    { field: 'open', headerName: 'Open', width: 110 },
    { field: 'high', headerName: 'High', width: 110 },
    { field: 'low', headerName: 'Low', width: 110 },
    { field: 'close', headerName: 'Close', width: 110 },
    { field: 'adjusted_close', headerName: 'Adjusted Close', width: 130 },
    { field: 'volume', headerName: 'Volume', width: 110 },
    { field: 'timestamp', headerName: 'Date', width: 110 },
    { field: 'profit', headerName: 'Profit', width: 190 }
];

// Data table for display search result
const BacktestDataTable = ({stock_json}) => {
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

export default BacktestDataTable;
