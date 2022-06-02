import Container from '@mui/material/Container';
import React from 'react';
import Backtest from '../features/portfolio/IndividualStockInfo';


const IndividualStockPage = () => {
    return (
        <Container maxWidth="lg">
            <Backtest />
        </Container>
    );
}

export default IndividualStockPage;