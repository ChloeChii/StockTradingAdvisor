import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux'
import { storeToken } from './features/account/accountSlice'
import ResponsiveAppBar from './features/responsiveAppBar/ResponsiveAppBar';
import ScreenerPage from './pages/screenerPage';
import SignUpPage from './pages/signUpPage';
import LoginPage from './pages/loginPage';
import PortfolioPage from './pages/portfolioPage';
import PortfolioDetailPage from './pages/portfolioDetailPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.css';

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
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;


