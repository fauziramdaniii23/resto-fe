import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {type Column, DataTable, type DataTableRef} from "@/pages/components/DataTable/Table.tsx";
import type {TApiPaginateResponse, TCategories, TImages, TMenus, TMetaData} from "@/type/type.ts";
import {MENUS} from "@/api/url.ts";
import {useRef, useState} from "react";
import {CREATE} from "@/constant";
import {requestGet} from "@/api/api.ts";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SearchInput from "@/pages/components/Search.tsx";
import {formatRupiah} from "@/pages/util/formatter.ts";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import type {MenusExtended} from "@/pages/admin/util/navigation.tsx";
import {useRedirect} from "@/pages/util/useRedirect.tsx";

const columns: Column<TMenus>[] = [
    {
        key: 'images.image_url',
        label: 'image',
        format: (val: TImages[]) => {
            if (val && val.length > 0) {
                return (
                    <img
                        src={val[0].image_url}
                        alt="Menu"
                        style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '4px'}}
                    />
                );
            }
            else {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, flexDirection: 'column' }}>
                        <ImageNotSupportedIcon/>
                    </Box>
                )
            }
        }

    },
    {
        key: 'name',
        label: 'Name'
    },
    {
        key: 'description',
        label: 'Description'
    },
    {
        key: 'categories.name',
        label: 'Category',
        format: (val : TCategories) => val.name
    },
    {
        key: 'price',
        label: 'Price',
        format: (val: number) => formatRupiah(val)
    }
]

export const Menus = () => {
    const redirect = useRedirect()
    const tableRef = useRef<DataTableRef>(null);
    const [dataMenus, setDataMenus] = useState<TMetaData<TMenus>>({} as TMetaData<TMenus>);
    const [loading, setLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');

    const onActionClick = (mode: string, data: TMenus) => {
        if (data && mode) {
            const detailMenu = {
                mode: mode,
                data: data,
            }
            const menu : MenusExtended = {
                id: '2.3.1',
                label: data.name,
                route: '/Dashboard/Menus/DetailMenu',
            }
            redirect(menu, detailMenu)
        }
    }

    const paramsTables = {
        keyword : keyword
    }

    const handleAddMenus = () => {
        onActionClick(CREATE, {} as TMenus);
    }

    const handleSearchEnter = () => {
        getDataMenus()
    }
    const clearAndRefresh = () => {
        setKeyword('');
        getDataMenus('');
    }

    const getDataMenus = (paramsKeyword?:string) => {
        setLoading(true);
        const params = {
            keyword: paramsKeyword ?? keyword,
            page: 1,
            pageSize: tableRef.current?.getPageSize(),
        }
        requestGet<TApiPaginateResponse<TMenus>>(MENUS, params)
            .then((res) => {
                if (res.success) {
                    setDataMenus(res.meta_data as TMetaData<TMenus>);
                }
            }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1}}>
                <Typography variant="h6" component="div">Data Menus</Typography>
                <Box sx={{display: 'flex', justifyContent: 'end', gap: 2}}>
                    <IconButton
                        sx={{
                            width: 40,
                        }}
                        size="small"
                        onClick={handleAddMenus}
                    >
                        <AddIcon/>
                    </IconButton>
                    <SearchInput
                        fullWidth
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onEnter={handleSearchEnter}
                        onRefresh={clearAndRefresh}
                    />
                </Box>
            </Box>

            <DataTable<TMenus>
                ref={tableRef}
                url={MENUS}
                params={paramsTables}
                columns={columns}
                data={dataMenus}
                loading={loading}
                action
                onActionClick={onActionClick}/>
        </Box>
    )
}