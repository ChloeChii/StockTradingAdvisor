import axios from 'axios';

const PortfolioAPI = {
    /**
     * Get user's portfolio.
     *
     * @param {String} token - Access token.
     * 
     * @return {Array} Portfolio objects.
     */
    GetAllPortfolio: async (token) => {
        try {
            const res = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/api/v1/accounts", {
                'headers': { 'Authorization': "bearer " + token }
            });
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return res.data;
        } catch (error) {
            throw error.response.data.detail;
        }
    },
    /**
     * Create Portfolio.
     *
     * 
     * @param {string} portfolioName Portfolio name
     * @param {String} token - Access token.
     * 
     * @return {Object} New portfolio item
     */
    CreatePortfolio: async (portfolioName, token) => {
        try {
            const data = {
                portfolioName: portfolioName
            }
            const res = await axios.post(process.env.REACT_APP_API_ENDPOINT + "/api/v1/accounts", data, {
                'headers': { 'Authorization': "bearer " + token }
            });
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return res.data;
        } catch (error) {
            throw error.response.data.detail;
        }
    },
    /**
     * Get portfolio detail by id.
     *
     * 
     * @param {string} id Portfolio id
     * @param {String} token - Access token.
     * 
     * @return {Object} Portfolio detail
     */
    GetPortfolioDetail: async (id, token) => {
        try {
            const res = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/api/v1/accounts/" + id, {
                'headers': { 'Authorization': "bearer " + token }
            });
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return res.data;
        } catch (error) {
            throw error.response.data.detail;
        }
    },
    /**
     * Add stock into the portfolio
     *
     * 
     * @param {string} id Portfolio id
     * @param {String} symbol - Stock Symbol.
     * @param {String} token - Access token.
     * 
     * @return {Object} New portfolio detail
     */
    AddStockToPortfolio: async (id, symbol, token) => {
        try {
            const data = {
                update_symbol: symbol,
                update_operation: "add"
            }
            const res = await axios.put(process.env.REACT_APP_API_ENDPOINT + "/api/v1/accounts/" + id, data, {
                'headers': { 'Authorization': "bearer " + token }
            });
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return res.data;
        } catch (error) {
            throw error.response.data.detail;
        }
    },
    /**
     * Remove stock from a portfolio.
     *
     * 
     * @param {string} id Portfolio id
     * @param {String} symbol - Stock Symbol.
     * @param {String} token - Access token.
     * 
     * @return {Object} New portfolio detail
     * 
     */
     RemoveStockFromPortfolio: async (id, symbol, token) => {
        try {
            const data = {
                update_symbol: symbol,
                update_operation: "remove"
            }
            const res = await axios.put(process.env.REACT_APP_API_ENDPOINT + "/api/v1/accounts/" + id, data, {
                'headers': { 'Authorization': "bearer " + token }
            });
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return res.data;
        } catch (error) {
            throw error.response.data.detail;
        }
    },
}

export default PortfolioAPI;