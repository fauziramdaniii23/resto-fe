import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import image2 from '@/assets/image2.jpg';
import {useAuthStore} from "@/store/useAuthStore.ts";
import Button from "@mui/material/Button";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {showToast} from "@/pages/util/toast.ts";
import DialogReservation from "@/pages/components/DialogReservation.tsx";
import {CREATE} from "@/constant";
import type {TReservation} from "@/type/type.ts";

const StyledBox = styled('div')(({ theme }) => ({
    alignSelf: 'center',
    width: '100%',
    height: 400,
    borderRadius: '50px',
    outline: '6px solid',
    outlineColor: 'hsla(220, 25%, 80%, 0.2)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.grey[200],
    boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
    backgroundImage: `url(${image2})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(10),
        height: 400,
        marginRight: theme.spacing(8),
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
        backgroundImage: `url(${image2})`,
        outlineColor: 'hsla(220, 20%, 42%, 0.1)',
        borderColor: (theme.vars || theme).palette.grey[700],
    }),
}));

export const Hero = () => {
    const auth = useAuthStore((state) => state);
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const handleClickOpen = () => {
        if(auth.isAuthenticated) {
            setOpen(true);
        } else {
            showToast('error', 'You must be logged in to make a reservation.');
            auth.logout()
            navigate('/SignIn');
        }
    }
    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: '100%',
                backgroundRepeat: 'no-repeat',

                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
                ...theme.applyStyles('dark', {
                    backgroundImage:
                        'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
                }),
            })}
        >
            <Container
                maxWidth={false}
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap:{ xs: 2, sm: 4 },
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    pt: { xs: 14, sm: 14, md: 4 },
                }}
            >
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, justifyContent: 'center' }}
                >
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ textAlign: 'center'}}
                    >
                        Welcome {auth.user?.name || ''} to our Restaurant
                    </Typography>
                    <Typography
                        variant="h1"
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                        }}
                    >
                        Reservation&nbsp;
                        <Typography
                            component="span"
                            variant="h1"
                            sx={(theme) => ({
                                fontSize: 'inherit',
                                color: 'primary.main',
                                ...theme.applyStyles('dark', {
                                    color: 'primary.light',
                                }),
                            })}
                        >
                            Now
                        </Typography>
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        useFlexGap
                        sx={{ width: { xs: '100%', sm: '350px' }, justifyContent: 'center' }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{minWidth: 'fit-content'}}
                            onClick={handleClickOpen}
                        >
                            Click here to Reservasi
                        </Button>
                        <DialogReservation authUser={auth.user} mode={CREATE} data={{} as TReservation} openDialog={open} onClose={() => setOpen(false)}/>
                    </Stack>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textAlign: 'center', pt:1 }}
                    >
                        By clicking &quot;Reservasi&quot; you agree to our&nbsp;
                        <Link href="#" color="primary">
                            Terms & Conditions
                        </Link>
                        .
                    </Typography>
                </Stack>
                {/*<StyledBox id="image" />*/}
            </Container>
        </Box>
    );
}