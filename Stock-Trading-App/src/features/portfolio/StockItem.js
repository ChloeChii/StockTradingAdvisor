import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import PortfolioAPI from '../../api/PortfolioAPI';



// Stock list item
const StockItem = (props) => {

    const [shouldRaised, setRaised] = React.useState(false);
    //const [stockJson, setStockJson] = React.useState([]);
    const {
        removeOnClick = () => { },
        stockName = "",
        handleStockInfoChange,
    } = props

    const searchStock = async (stockName) => {
        // POST request
        // console.log(conditions);
        let data = [];
        // let symbol = "AAPL";
        data.push('symbol');
        data.push(stockName);
        // console.log(data, symbol);
        const res = await PortfolioAPI.SearchStockBySymbol(data, stockName);
        //console.log("res:" + res);
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            res[i]['id'] = i;
        }
        handleStockInfoChange(res); 
        //setStockJson(res);
    }
    
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
                        <Typography variant="h4" sx={{ fontSize: 24 }} color="text.primary" >
                            {stockName}
                        </Typography>
                        <Button onClick={() => searchStock(stockName)}>View Stock</Button>
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
