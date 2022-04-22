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
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';

import Alert from '../features/utils/Alert';
import AccountAPI from '../api/AccountAPI'

const SignUpPage = () => {

    const navigate = useNavigate();

    const [userNameHelperText, setUserNameHelperText] = React.useState("");
    const [passwordHelperText, setPassWordHelperText] = React.useState("");
    const [isSnackOpen, setSnackOpen] = React.useState(false);
    const [snackText, setSnackText] = React.useState("");

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
        const jsonData = {
            username: formData.get("username"),
            password: formData.get("password"),
        }

        try {
            const result = await AccountAPI.SignUp(jsonData);
            if (result) {
                setSnackOpen(true);
                setSnackText("Sign up success! Redirect to login in 3 seconds");
                setTimeout(
                    () => navigate("/login"),
                    3000
                );
            }
        } catch (error) {
            if (error && typeof(error) == "string") {
                setUserNameHelperText(error);
            } else {
                setUserNameHelperText("Signup failed, please check logs");
            }
        }
    };

    // Handle snack notification close
    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    return (
        <>
            <Snackbar
                open={isSnackOpen}
                onClose={handleSnackClose}
                autoHideDuration={6000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                    {snackText}
                </Alert>
            </Snackbar>
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
                        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="username"
                                        label="User Name"
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
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        Already have an account? Login
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}

export default SignUpPage;