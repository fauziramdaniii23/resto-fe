import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Home as HomeIcon,
    ArrowBack as ArrowBackIcon,
    SentimentVeryDissatisfied as SadIcon,
} from '@mui/icons-material';

const PageNotFound: React.FC = () => {
    const theme = useTheme();

    const handleGoHome = () => {
        // Dalam implementasi nyata, gunakan router navigate
        window.location.href = '/';
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={8}
                    sx={{
                        padding: { xs: 4, md: 6 },
                        textAlign: 'center',
                        borderRadius: 4,
                        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* 404 Number */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '6rem', md: '10rem' },
                            fontWeight: 900,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            marginBottom: 2,
                            lineHeight: 0.8,
                        }}
                    >
                        404
                    </Typography>

                    {/* Sad Icon */}
                    <Box sx={{ mb: 3 }}>
                        <SadIcon
                            sx={{
                                fontSize: { xs: '4rem', md: '6rem' },
                                color: theme.palette.text.secondary,
                                opacity: 0.7,
                            }}
                        />
                    </Box>

                    {/* Main Title */}
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            marginBottom: 2,
                            fontSize: { xs: '2rem', md: '3rem' },
                            color: theme.palette.text.primary,
                        }}
                    >
                        Oops! Halaman Tidak Ditemukan
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="h6"
                        sx={{
                            marginBottom: 4,
                            color: theme.palette.text.secondary,
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            maxWidth: '600px',
                            margin: '0 auto 2rem auto',
                            lineHeight: 1.6,
                        }}
                    >
                        Maaf, halaman yang Anda cari tidak dapat ditemukan.
                        Mungkin anda tidak memiliki akses, atau URL yang dimasukkan salah.
                    </Typography>

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            mt: 4,
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<HomeIcon />}
                            onClick={handleGoHome}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                boxShadow: theme.shadows[4],
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                '&:hover': {
                                    boxShadow: theme.shadows[8],
                                    transform: 'translateY(-2px)',
                                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Kembali ke Beranda
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleGoBack}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4],
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Halaman Sebelumnya
                        </Button>
                    </Box>

                    {/* Additional Info */}
                    <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                fontSize: '0.9rem',
                            }}
                        >
                            Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator.
                        </Typography>
                    </Box>
                </Paper>

                {/* Floating Animation Elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: 60,
                        height: 60,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: '50%',
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' },
                        },
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        top: '20%',
                        right: '15%',
                        width: 40,
                        height: 40,
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        borderRadius: '50%',
                        animation: 'float 4s ease-in-out infinite reverse',
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '15%',
                        left: '20%',
                        width: 30,
                        height: 30,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        borderRadius: '50%',
                        animation: 'float 5s ease-in-out infinite',
                    }}
                />
            </Container>
        </Box>
    );
};

export default PageNotFound;