import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';


// Data table for display search result
const BacktestDataTable = ({stock_json}) => {

    let columns = [
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

    if (stock_json.length > 0) {
      let newColumns = [];
      for (var key in stock_json[0]) {
        if (key != "id") {
          let str = key.charAt(0).toUpperCase() + key.slice(1);
          newColumns.push({field: key, headerName: str});
        }
      } 

      for (var i = 0; i < newColumns.length; i++) {
        newColumns[i]["width"] = 1100 / newColumns.length;
      }
      columns = newColumns;
    }

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
