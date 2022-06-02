import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import PortfolioAPI from '../api/PortfolioAPI';
import NewDialog from '../features/portfolio/NewDialog';
import PortfolioBar from '../features/portfolio/PortfolioBar';
import PortfolioItem from '../features/portfolio/PortfolioItem';
import Alert from '../features/utils/Alert';





const PortfolioPage = () => {

    const [cookies, setCookie] = useCookies(["token"]);
    const accountToken = useSelector((state) => state.account.token)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [newPortfolioName, setNewPortfolioName] = React.useState("");
    const [isNewPortfolioDialogOpen, setNewPortfolioDialogOpen] = React.useState(false);
    const [portfolios, setPortfolio] = React.useState([]);
    const [isSnackOpen, setSnackOpen] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState("success");

    // Get user's portfolios by account token
    React.useEffect(async () => {
        if (accountToken) {
            try {
                const result = await PortfolioAPI.GetAllPortfolio(accountToken);
                if (result) {
                    setPortfolio(result);
                    console.log(result);
                }
            } catch (error) {
                if (error && typeof (error) == "string") {
                    console.log(error)
                    triggerSnack("error", error);
                }
            }
        }
    }, [accountToken]);

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

    // Create new portfolio
    const createPortfolio = React.useCallback(async () => {
        if (!newPortfolioName || !accountToken) {
            return;
        }
        try {
            const newPortfolioItem = await PortfolioAPI.CreatePortfolio(newPortfolioName, accountToken);
            if (newPortfolioItem.id !== undefined) {
                setPortfolio([...portfolios, newPortfolioItem]);
                setNewPortfolioName("");
                triggerSnack("success", "Create succeed!");
            }
        } catch (error) {
            console.log(error);
            triggerSnack("error", "Some error happened, please check the console");
        }

    }, [newPortfolioName, accountToken, portfolios, setPortfolio])

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
                    open={isNewPortfolioDialogOpen}
                    setOpen={setNewPortfolioDialogOpen}
                    dialogTitle="New Portfolio"
                    inputLabel="Name"
                    newName={newPortfolioName}
                    setNewName={setNewPortfolioName}
                    createOnClick={createPortfolio}
                />
                <Box
                    sx={{
                        my: 5,
                    }}
                >
                    <PortfolioBar
                        title="Portfolios"
                        newItemText="Create"
                        newButtonClick={() => {
                            setNewPortfolioDialogOpen(true);
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
                            >
                                {
                                    portfolios.map((portfolio) =>
                                        <PortfolioItem
                                            key={portfolio.id}
                                            portfolioName={portfolio.portfolioName}
                                            portfolioOnClick={() => {
                                                navigate("/portfolio/" + portfolio.id);
                                            }}
                                        />
                                    )
                                }
                            </Grid>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
}

export default PortfolioPage;