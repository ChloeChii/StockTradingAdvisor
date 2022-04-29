import Container from '@mui/material/Container';
import React from 'react';
import Backtest from '../features/backtest/Backtest';


const BacktestPage = () => {
    return (
        <Container maxWidth="lg">
            <Backtest />
        </Container>
    );
}

export default BacktestPage;