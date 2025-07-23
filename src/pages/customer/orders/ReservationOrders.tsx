import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useState} from "react";
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
import {SyledCard, SyledCardContent} from "@/pages/components/card/StyleCard.tsx";

const ReservationOrders = () => {
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

    return (
        <Box>
            <Box
                sx={{display: 'flex', justifyContent: 'space-between', pt: 2}}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Reservation
                </Typography>
                <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                    <SearchInput
                        placeholder="Search by Note..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onEnter={getDataReservation}
                        fullWidth
                    />
                </Box>
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
                                        sx={{color: 'primary.main', mr: 0.5}}
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
                                                        Table
                                                        : {item.tables.map(table => table.table_number).join(', ')}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Note : {item.note || 'Tidak ada catatan'}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            gap: 1,
                                                            mt: 2
                                                        }}
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
        </Box>
    )
}

export default ReservationOrders;