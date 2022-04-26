import Container from '@mui/material/Container';
import React from 'react';
import Screener from '../features/backtest/Backtest';


const BacktestPage = () => {
    return (
        <Container maxWidth="lg">
            <Screener />
        </Container>
    );
}

export default BacktestPage;