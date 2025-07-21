import Container from '@mui/material/Container';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {useEffect, useState} from "react";
import {requestGet} from "@/api/api.ts";
import {useAuthStore} from "@/store/useAuthStore.ts";
import type {TApiPaginateResponse, TMetaData, TReservation} from "@/type/type.ts";
import Grid from "@mui/material/Grid";
import Loader from "@/pages/components/Loader.tsx";
import {formatDate} from "@/pages/util/parsingdate.ts";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import SearchInput from "@/pages/components/Search.tsx";
import DataNotFound from "@/pages/components/DataNotFound.tsx";
import Link from '@mui/material/Link';
import DialogReservation from "@/pages/customer/components/DialogReservation.tsx";
import PaginationViews from "@/pages/components/PaginationView.tsx";

const SyledCard = styled(Card)(() => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    '&:hover': {
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    },
}));

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

export default function Orders() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [reservation, setReservation] = useState<TMetaData<TReservation>>();
    const [search, setSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const getDataReservation = (page?: number, pageSize?: number) => {
        setLoading(true);
        const params = {
            user_id: user?.id,
            search: search,
            page: page ?? 1,
            pageSize: pageSize ?? 4,
        }
        requestGet<TApiPaginateResponse<TReservation>>('/reservation-customer', params)
            .then((res) => {
                if (res.success) {
                    setReservation(res.meta_data);
                }
            }).finally(() => {
            setLoading(false);
        })
    }
    useEffect(() => {
        getDataReservation()
    }, []);
    return (
        <Container
            maxWidth={false}
            sx={{
                pt: {xs: 16, sm: 16, md: 12}
            }}
        >
            <Box
                sx={{display: 'flex', justifyContent: 'space-between', pt: 2}}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Reservation
                </Typography>
                <SearchInput
                    placeholder="Search by Note..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onEnter={getDataReservation}
                />
            </Box>
            <Box
                sx={{
                    position: "relative",
                    my: 2,
                    minHeight: '20vh',
                }}
            >
                <Loader size="small" show={loading}/>
                <Grid
                    container
                    spacing={2}
                    columns={4}
                >
                    {
                        reservation?.data.length === 0 ? (
                            <Box sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                width: '100%',
                                minHeight: '10vh',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}>
                                <DataNotFound/>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <Link
                                        underline="hover"
                                        component="button"
                                        onClick={() => setOpenDialog(true)}
                                        sx={{color: 'primary.main', mr: 0.5}} // warna biru + jarak kanan
                                    >
                                        Click here
                                    </Link>
                                    <Typography>to Reservation</Typography>
                                </Box>
                                <DialogReservation open={openDialog} onClose={() => setOpenDialog(false)}/>
                            </Box>

                        ) : (
                            <>
                            {
                                reservation?.data?.map((item: TReservation) => (
                                <Grid size={2}>
                                    <SyledCard
                                        key={item.id}
                                        sx={{
                                            flex: '1 1 calc(50%)',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <SyledCardContent>
                                            <Typography variant="h6" component="div">
                                                {formatDate(item.reserved_at)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Table : {item.tables.map(table => table.table_number).join(', ')}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Note : {item.note || 'Tidak ada catatan'}
                                            </Typography>
                                            <Box
                                                sx={{display: 'flex', justifyContent: 'space-between', gap: 1, mt: 2}}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    gap: 1,
                                                    alignItems: 'center'
                                                }}>
                                                    <Avatar sx={{
                                                        width: 32,
                                                        height: 32
                                                    }}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Avatar>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {user?.name || 'User tidak ditemukan'}</Typography>
                                                </Box>
                                                <Chip
                                                    color={
                                                        item.status === 'confirmed' ? 'success' :
                                                            item.status === 'pending' ? 'warning' :
                                                                item.status === 'canceled' ? 'error' : 'default'
                                                    }
                                                    label={item.status}/>
                                            </Box>
                                        </SyledCardContent>
                                    </SyledCard>
                                </Grid>
                            ))
                            }
                            <Box sx={{width: '100%', alignItems: 'end'}}>
                                <PaginationViews rowCount={reservation?.total ?? 0} onChange={getDataReservation}/>
                            </Box>
                            </>
                        )
                    }
                </Grid>
            </Box>
        </Container>
    );
}
