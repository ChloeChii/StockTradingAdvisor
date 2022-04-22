import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux'
import { removeToken } from '../account/accountSlice'

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';


const UserMenu = () => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const accountToken = useSelector((state) => state.account.token)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Handle user menu click event 
    const userMenuOnClick = (setting) => {
        // If a user click logout
        if (setting == "Logout") {
            // Clean token cookie
            removeCookie("access_token", { path: "/" });
            // Clean redux state
            dispatch(removeToken());
            // Redirect to home page
            navigate("/");
            // Refresh page
            window.location.reload();
        } else if (setting) {
            // If a user click other button like login and signup
            // Navigate to that page directly
            navigate("/" + setting.toLowerCase());
        }
        handleCloseUserMenu();
    };

    return (
        <Box>
            <IconButton onClick={handleOpenUserMenu} size="large">
                <AccountCircleIcon />
            </IconButton>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {
                    accountToken === "" ?
                        [
                            <MenuItem
                                key={"Login"}
                                onClick={() => {
                                    userMenuOnClick("Login");
                                }}
                            >
                                <Typography textAlign="center">{"Login"}</Typography>
                            </MenuItem>,
                            <MenuItem
                                key={"Signup"}
                                onClick={() => {
                                    userMenuOnClick("Signup");
                                }}
                            >
                                <Typography textAlign="center">{"Signup"}</Typography>
                            </MenuItem>
                        ]
                        :
                        [
                            <MenuItem
                                key={"Logout"}
                                onClick={() => {
                                    userMenuOnClick("Logout");
                                }}
                            >
                                <Typography textAlign="center">{"Logout"}</Typography>
                            </MenuItem>
                        ]
                }
            </Menu>
        </Box>
    );
};
export default UserMenu;