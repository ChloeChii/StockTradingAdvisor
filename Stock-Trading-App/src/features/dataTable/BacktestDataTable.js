import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';


// Data table for display search result
const BacktestDataTable = ({stock_json}) => {

    const [columns, setColumns] = React.useState([
      { field: 'symbol', headerName: 'Symbol', width: 120 },
      { field: 'open', headerName: 'Open', width: 120 },
      { field: 'high', headerName: 'High', width: 120 },
      { field: 'low', headerName: 'Low', width: 120 },
      { field: 'close', headerName: 'Close', width: 120 },
      { field: 'adjusted_close', headerName: 'Adjusted Close', width: 130 },
      { field: 'volume', headerName: 'Volume', width: 120 },
      { field: 'timestamp', headerName: 'Date', width: 120 },
      { field: 'profit', headerName: 'Profit', width: 130 }
    ]);

    React.useEffect(() => {
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
        setColumns(newColumns);
      }
    }, [stock_json]);

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
