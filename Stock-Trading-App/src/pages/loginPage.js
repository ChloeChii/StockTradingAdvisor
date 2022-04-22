import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux'
import { storeToken } from '../features/account/accountSlice'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import AccountAPI from '../api/AccountAPI'

const LoginPage = () => {

    const navigate = useNavigate();
    const [userNameHelperText, setUserNameHelperText] = React.useState("");
    const [passwordHelperText, setPassWordHelperText] = React.useState("");

    const [cookies, setCookie] = useCookies(["token"]);
    const accountToken = useSelector((state) => state.account.token)
    const dispatch = useDispatch()

    // If the user already logged in, redirect to screener page
    React.useEffect(() => {
        console.log(accountToken)
        if (accountToken) {
            navigate("/screener");
        }
    }, [accountToken]);

    // Do some very naive sanity check
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (!formData.get("username")) {
            setUserNameHelperText("User name cannot be empty");
            return
        }

        if (!formData.get("password")) {
            setPassWordHelperText("Password cannot be empty");
            return
        }
        try {
            const result = await AccountAPI.Login(formData);

            if (result) {
                setCookie("access_token", result.access_token, { path: "/" })
                dispatch(storeToken(result.access_token));
            }
        } catch (error) {
            if (error && typeof (error) == "string") {
                setPassWordHelperText(error);
            } else {
                setUserNameHelperText("Login failed, please check logs");
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={2} sx={{ px: 4, py: 4, my: 10 }} >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "#707070" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="User name"
                                    name="username"
                                    autoComplete="user-name"
                                    helperText={userNameHelperText}
                                    onChange={event => setUserNameHelperText("")}
                                    error={userNameHelperText !== ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    helperText={passwordHelperText}
                                    onChange={event => setPassWordHelperText("")}
                                    error={passwordHelperText !== ""}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    Sign up for an account
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginPage;