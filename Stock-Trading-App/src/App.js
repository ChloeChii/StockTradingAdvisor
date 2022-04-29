import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Route, Routes } from "react-router-dom";
import './App.css';
import { storeToken } from './features/account/accountSlice';
import ResponsiveAppBar from './features/responsiveAppBar/ResponsiveAppBar';
import BacktestPage from './pages/backtestPage';
import LoginPage from './pages/loginPage';
import PortfolioDetailPage from './pages/portfolioDetailPage';
import PortfolioPage from './pages/portfolioPage';
import ScreenerPage from './pages/screenerPage';
import SignUpPage from './pages/signUpPage';




// Set the primarty theme color
const theme = createTheme({
    palette: {
        primary: {
            main: "#707070",
        },
    },
});

const App = () => {
    const [cookies, setCookie] = useCookies(["token"]);
    const dispatch = useDispatch()

    // Check if has logged in
    React.useEffect(() => {
        // If logged in, set the access token into redux state
        if (cookies.access_token) {
            dispatch(storeToken(cookies.access_token));
        }
    }, [cookies])

    return (
        <ThemeProvider theme={theme}>
            <ResponsiveAppBar />
            <Routes>
                <Route path="/" element={<ScreenerPage />} />
                <Route path="/screener" element={<ScreenerPage />} />
                <Route path="/backtest" element={<BacktestPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;


