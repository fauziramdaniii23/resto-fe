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
import PaginationViews from "@/pages/components/PaginationView.tsx";
import {SyledCard, SyledCardContent} from "@/pages/components/card/StyleCard.tsx";
import DialogReservation from "@/pages/components/DialogReservation.tsx";
import {CREATE, VIEW, EDIT} from "@/constant";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {IconButtonEdit} from "@/pages/components/button/styleIconButton.tsx";
import {RESERVATION} from "@/api/url.ts";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";

const OrdersReservation = () => {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [reservation, setReservation] = useState<TMetaData<TReservation>>();
    const [keyword, setKeyword] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [mode, setMode] = useState(CREATE);

    const getDataReservation = (paramsKeyword?: string, page?: number, pageSize?: number) => {
        setLoading(true);
        const params = {
            user_id: user?.id,
            keyword: paramsKeyword ?? keyword,
            page: page ?? 1,
            pageSize: pageSize ?? 4,
        }
        requestGet<TApiPaginateResponse<TReservation>>(`${RESERVATION}/customer`, params)
            .then((res) => {
                const data = res.meta_data;
                if (res.success) {
                    setReservation(data);
                }
            }).finally(() => {
            setLoading(false);
        })
    }

    const handleRefresh = () => {
        setKeyword("");
        getDataReservation('');
    }
    const handleChangePage = (page: number, pageSize: number) => {
        getDataReservation(keyword, page, pageSize);
    }

    const [dataReservation, setDataReservation] = useState<TReservation>({} as TReservation);
    const openDialogReservation = (mode: string, data : TReservation) => {
        setDataReservation(data);
        setMode(mode);
        setOpenDialog(true);
    }

    const isDisable = (date: string): boolean => {
        const inputDate = dayjs(date).startOf('day');
        const today = dayjs().startOf('day');

        return inputDate.isBefore(today);
    };


    return (
        <Box>
            <DialogReservation authUser={user} mode={mode} data={dataReservation} openDialog={openDialog} onClose={() => setOpenDialog(false)} onRefresh={handleRefresh}/>
            <Box
                sx={{display: 'flex', justifyContent: 'end'}}
            >
                <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                    <IconButton
                        sx={{
                            width: 40,
                        }}
                        size="small"
                        onClick={() => openDialogReservation(CREATE, {} as TReservation)}
                    >
                        <AddIcon/>
                    </IconButton>
                    <SearchInput
                        placeholder="Search..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onEnter={getDataReservation}
                        fullWidth
                        onRefresh={handleRefresh}
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
                                        onClick={() => openDialogReservation(CREATE ,{} as TReservation)}
                                        sx={{color: 'primary.main', mr: 0.5}}
                                    >
                                        Click here
                                    </Link>
                                    <Typography>to Reservation</Typography>
                                </Box>
                            </Box>

                        ) : (
                            <>
                                {
                                    reservation?.data?.map((item: TReservation, idx) => (
                                        <Grid size={2} key={idx}>
                                            <SyledCard
                                                onClick={ () => openDialogReservation(VIEW, item) }
                                                key={item.id}
                                                sx={{
                                                    flex: '1 1 calc(50%)',
                                                    boxSizing: 'border-box',
                                                    position : 'relative',
                                                }}
                                            >
                                                <SyledCardContent>
                                                    <IconButtonEdit disabled={isDisable(item.reserved_at) || item.status === 'confirmed'} sx={{position: 'absolute', right: 10, top: 10}} onClick={(e) => {e.stopPropagation(); openDialogReservation(EDIT, item)}}><EditSquareIcon/></IconButtonEdit>
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
                                    <PaginationViews showPageSize pageSizeValue={[4, 8, 24, 40]} rowCount={reservation?.total ?? 0} onChange={handleChangePage}/>
                                </Box>
                            </>
                        )
                    }
                </Grid>
            </Box>
        </Box>
    )
}

export default OrdersReservation;