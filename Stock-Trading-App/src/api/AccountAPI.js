import axios from 'axios';

const AccountAPI = {
    /**
     * Login.
     *
     * @param {FormData} FormData data
     * @param {String} FormData.username - User Name.
     * @param {String} FormData.password - Password.
     * 
     * @return {Object} A token object.
     * @return {String} return.access_token - Access token.
     * @return {String} return.token_type - The token type, typically is bearer.
     */
    Login: async (data) => {
        try {
            const form = new FormData();
            form.append("username", data.username);
            form.append("password", data.password);

            const res = await axios.post(process.env.REACT_APP_API_ENDPOINT + "/api/v1/login", data);
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return res.data;
        } catch (error) {
            throw error.response.data.detail;
        }
    },
    /**
     * Sign up.
     *
     * @param {Object} object data
     * @param {string} object.username User Name
     * @param {string} object.password Password
     * 
     * @return {Boolean} Indicate whether sign up is succeed.
     */
    SignUp: async (data) => {
        try {
            const res = await axios.post(process.env.REACT_APP_API_ENDPOINT + "/api/v1/accounts/signup", data);
            if (!res.status === 200) {
                throw Error(res.statusText);
            }
            return true;
        } catch (error) {
            throw error.response.data.detail;
        }
    }
}

export default AccountAPI;