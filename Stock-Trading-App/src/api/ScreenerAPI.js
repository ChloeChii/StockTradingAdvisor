import axios from 'axios';

const ScreenerAPI = {
    /**
     * Get all filters
     *
     * @return {Array} Filters
     */
    GetFilterList: async () => {
        try {
            const res = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/api/v1/screeners/filters");
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return res.data;
        } catch (error) {
            throw error.response.data.detail;
        }
    },
    /**
     * Search stocks by filters
     *
     * 
     * @param {Array} data Filters
     * 
     * @return {Array} Array of filtered stocks
     */
    SearchByFilter: async (data) => {
        try {
            const res = await axios.post(
                process.env.REACT_APP_API_ENDPOINT + "/api/v1/screeners/prices_by_filters?date=2021-08-10&sortby=volume%20%2A%20close&order=DESC",
                data,
                {
                    'Content-Type': 'application/json'
                });
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return res.data;
        } catch (error) {
            throw error.response.data.detail;
        }
    },
    BacktestFilter: async (data, dateIn, dateOut) => {
        try {
            const res = await axios.post(
                process.env.REACT_APP_API_ENDPOINT + "/api/v1/screeners/backtest?dateIn=" + dateIn + "&dateOut=" + dateOut + "&sortby=volume%2Aclose&order=DESC",
                data,
                {
                    'Content-Type': 'application/json'
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

export default ScreenerAPI;
