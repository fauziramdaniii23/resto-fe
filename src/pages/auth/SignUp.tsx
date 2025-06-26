import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import AppTheme from '../../theme/AppTheme';
import {GoogleIcon} from '../components/CustomIcons';
import ColorModeSelect from '../../theme/ColorModeSelect';
import {Link as RouterLink} from 'react-router-dom';
import {useState} from "react";
import {redirectToGoogle, requestPost} from "../../api/api.ts";
import type {TApiResponse, TUser} from "../../type/type.ts";
import {redirectTo} from "../util/navigation.ts";
import {showToast} from "../util/toast.ts";
import Loader from "../components/Loader.tsx";
import DialogVerifyEmail from "../components/DialogVerifyEmail.tsx";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({theme}) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVerifyEmail, setDialogVerifyEmail] = useState(false);
    const [user, setUser] = useState<{ email: string; password: string }>();

    function handleClick(loading: boolean) {
        setLoading(loading);
    }

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const name = document.getElementById('name') as HTMLInputElement;
        const userName = document.getElementById('userName') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }
        if (!userName.value || userName.value.length < 1) {
            setUserNameError(true);
            setUserNameErrorMessage('userName is required.');
            isValid = false;
        } else {
            setUserNameError(false);
            setUserNameErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (nameError || emailError || passwordError) {
            return;
        }
        handleClick(true);
        const data = new FormData(event.currentTarget);
        setUser({
            email: (data.get('email') as string) || '',
            password: (data.get('password') as string) || '',
        })
        const payload = {
            name: data.get('name'),
            userName: data.get('userName'),
            email: data.get('email'),
            password: data.get('password'),
        };
        requestPost<TApiResponse<TUser>, typeof payload>('/register-api', payload)
            .then((res) => {
                if (res.success) {
                    redirectTo('/SignIn', {replace: true});
                    showToast('success', 'Registration successful! Check your email!');
                }
            }).catch((error) => {
            const data = error.response?.data;
            if (data?.info == 'Email belum diverifikasi.') {
                handleOpenVerifyDialog()
            }
        }).finally(() => {
            handleClick(false);
        })
    };
    const handleOpenVerifyDialog = () => setDialogVerifyEmail(true);
    const handleCloseVerifyDialog = () => setDialogVerifyEmail(false);
    return (
        <AppTheme {...props}>
            <Loader show={loading}/>
            <DialogVerifyEmail
                open={dialogVerifyEmail}
                onClose={handleCloseVerifyDialog}
                userData={user}
            />
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Full name</FormLabel>
                            <TextField
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="Full Name"
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="userName">Username</FormLabel>
                            <TextField
                                autoComplete="userName"
                                name="userName"
                                required
                                fullWidth
                                id="userName"
                                placeholder="userName"
                                error={userNameError}
                                helperText={userNameErrorMessage}
                                color={userNameError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            loading={loading}
                            loadingPosition="end"
                            color="secondary"
                            onClick={validateInputs}
                        >
                            Sign up
                        </Button>
                    </Box>
                    <Divider>
                        <Typography sx={{color: 'text.secondary'}}>or</Typography>
                    </Divider>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={redirectToGoogle}
                            startIcon={<GoogleIcon/>}
                        >
                            Sign up with Google
                        </Button>
                        <Typography sx={{textAlign: 'center'}}>
                            Already have an account?{' '}
                            <Link
                                component={RouterLink}
                                to="/SignIn"
                                variant="body2"
                                sx={{alignSelf: 'center'}}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}