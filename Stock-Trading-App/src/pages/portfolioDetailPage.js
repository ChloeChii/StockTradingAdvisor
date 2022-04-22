import * as React from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux'
import {
    useParams
} from "react-router-dom";

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';

import PortfolioBar from '../features/portfolio/PortfolioBar'
import StockItem from '../features/portfolio/StockItem'
import NewDialog from '../features/portfolio/NewDialog'
import Alert from '../features/utils/Alert';

import PortfolioAPI from '../api/PortfolioAPI'


const PortfolioDetailPage = () => {
    // Get current portfolio detail id from url
    let { id } = useParams();
    const [cookies, setCookie] = useCookies(["token"]);
    const accountToken = useSelector((state) => state.account.token)
    const dispatch = useDispatch()

    const [newStockSymbol, setNewStockSymbol] = React.useState("");
    const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);
    const [portfolioDetail, setPortfolioDetail] = React.useState({});
    const [isSnackOpen, setSnackOpen] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState("success");

    // Get the portfolio information by account token and id
    React.useEffect(async () => {
        if (accountToken && id != undefined) {
            try {
                const result = await PortfolioAPI.GetPortfolioDetail(id, accountToken);
                if (result) {
                    setPortfolioDetail(result);
                    console.log(result);
                }
            } catch (error) {
                if (error && typeof (error) == "string") {
                    console.log(error)
                    triggerSnack("error", error);
                }
            }
        }
    }, [id, accountToken]);

    // Handle snack notification close
    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    // Set snack value and show it
    const triggerSnack = (severity, text) => {
        setSnackSeverity(severity);
        setSnackText(text);
        setSnackOpen(true)
    }

    // Add stock to this portfolio and refresh the page
    const addStock = React.useCallback(async () => {
        if (!accountToken || !newStockSymbol || id == undefined) {
            return;
        }
        try {
            const newPortfolioDetail = await PortfolioAPI.AddStockToPortfolio(id, newStockSymbol, accountToken);
            if (newPortfolioDetail.portfolioName != undefined) {
                setPortfolioDetail(newPortfolioDetail);
                setNewStockSymbol("");
                triggerSnack("success", "Add succeed!");
            }
        } catch (error) {
            console.log(error);
            triggerSnack("error", "Some error happened, please check the console");
        }


    }, [accountToken, newStockSymbol, id, setPortfolioDetail])

    // Add the stock from this portfolio
    const removeStock = React.useCallback(async (newStockSymbol) => {
        if (!accountToken || !newStockSymbol || id == undefined) {
            return;
        }
        try {
            const newPortfolioDetail = await PortfolioAPI.RemoveStockFromPortfolio(id, newStockSymbol, accountToken);
            if (newPortfolioDetail.portfolioName != undefined) {
                setPortfolioDetail(newPortfolioDetail);
                setNewStockSymbol("");
                triggerSnack("success", "Remove succeed!");
            }
        } catch (error) {
            console.log(error);
            triggerSnack("error", "Some error happened, please check the console");
        }

    }, [accountToken, id, setPortfolioDetail])


    return (
        <>
            <Snackbar
                open={isSnackOpen}
                onClose={handleSnackClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                autoHideDuration={6000}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
                    {snackText}
                </Alert>
            </Snackbar>
            <Container maxWidth="lg" component="main">
                <NewDialog
                    open={isAddDialogOpen}
                    setOpen={setAddDialogOpen}
                    dialogTitle="Add Stock"
                    inputLabel="Stock Symbol"
                    newName={newStockSymbol}
                    setNewName={setNewStockSymbol}
                    createOnClick={addStock}
                />
                <Box
                    sx={{
                        my: 5,
                    }}
                >
                    <PortfolioBar
                        title={portfolioDetail.portfolioName ? portfolioDetail.portfolioName : "Portfolios"}
                        newItemText="Add"
                        newButtonClick={() => {
                            setAddDialogOpen(true);
                        }}
                    />
                    <Paper variant="outlined" sx={{ px: 4, py: 3, mt: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Grid
                                container
                                spacing={1}
                            >
                                {
                                    (portfolioDetail.stocks != undefined && portfolioDetail.stocks.length > 0)
                                        ?
                                        portfolioDetail.stocks.map((stock) =>
                                            <StockItem
                                                key={stock.stockSymbol}
                                                stockName={stock.stockSymbol}
                                                removeOnClick={() => {
                                                    removeStock(stock.stockSymbol);
                                                }}
                                            />
                                        )
                                        :
                                        <Typography>
                                            No stock in this portfolio yet.
                                        </Typography>
                                }
                            </Grid>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
}

export default PortfolioDetailPage;