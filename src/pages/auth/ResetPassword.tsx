import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import AppTheme from '../../theme/AppTheme.tsx';
import ColorModeSelect from '../../theme/ColorModeSelect.tsx';
import {useEffect, useState} from "react";
import {requestPost} from "../../api/api.ts";
import {useSearchParams, useNavigate} from 'react-router-dom';
import {showToast} from "../util/toast.ts";
import type {TApiResponse, Void} from "@/type/type.ts";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({theme}) => ({
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


export default function ResetPassword(props: { disableCustomTheme?: boolean }) {
    const [searchParams] = useSearchParams();

    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const token = searchParams.get('token') || '';
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/PageNotFound');
            return;
        }
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (passwordError) {
            return;
        }
        setLoading(true)
        const payload = {
            token: token,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
        }

        requestPost<TApiResponse<Void>, typeof payload>('/reset-password', payload)
            .then((res) => {
                if (res.success) {
                    showToast('success', res.info ?? 'Password reset successfully.');
                    navigate('/SignIn');
                }
            })
            .catch(() => {

            })
            .finally(() => {
                setLoading(false)
            })
    };


    const validateInputs = () => {

        let isValid = true;

        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        if (!passwordConfirmation || passwordConfirmation.length < 6) {
            setPasswordConfirmationError(true);
            setPasswordConfirmationErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        if (password !== passwordConfirmation) {
            setPasswordError(true);
            setPasswordErrorMessage('Password and confirmation do not match.');
            setPasswordConfirmationErrorMessage('Password and confirmation do not match.');
            setPasswordConfirmationError(true)
        }
        return isValid;
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>

            <SignInContainer direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Reset Password
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                value={email}
                                disabled={true}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Confirmation Password</FormLabel>
                            <TextField
                                error={passwordConfirmationError}
                                helperText={passwordConfirmationErrorMessage}
                                name="passwordConfirmation"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordConfirmationError ? 'error' : 'primary'}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            loadingPosition="end"
                            variant="contained"
                            color="secondary"
                            onClick={validateInputs}
                        >
                            Submit
                        </Button>
                    </Box>
                </Card>
            </SignInContainer>
        </AppTheme>
    );
}
