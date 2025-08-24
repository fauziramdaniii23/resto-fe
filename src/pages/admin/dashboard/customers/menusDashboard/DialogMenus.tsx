import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import {useEffect, useState} from "react";
import {Autocomplete, CircularProgress, InputAdornment} from "@mui/material";
import {requestDelete, requestGet, requestPost} from "@/api/api.ts";
import type {TApiResponse, TCategories, TMenus, Void} from "@/type/type.ts";
import {showToast} from "@/pages/util/toast.ts";
import {VIEW, EDIT, CREATE, DELETE, SUCCESS, ERROR} from "@/constant";
import Typography from "@mui/material/Typography";
import {MENUS} from "@/api/url.ts";
import Input from '@mui/material/Input';
import type {MenusExtended} from "@/pages/admin/util/navigation.tsx";
import {useRedirect} from "@/pages/util/useRedirect.tsx";

type DialogMenusProps = {
    mode: string;
    data: TMenus;
    openDialog: boolean;
    onClose?: () => void;
    onRefresh?: () => void;
};

export default function DialogMenus ({mode, data, openDialog, onClose, onRefresh}: DialogMenusProps) {
    const redirect = useRedirect()
    const title: string = mode === CREATE ? 'Create Menu' : mode === VIEW ? 'View Menu' : mode === EDIT ? 'Edit Menu' : mode === 'delete' ? 'Delete Menu ?' : 'Create Menu';
    const [name, setName] = useState<string>(data.name);
    const [description, setDescription] = useState<string>(data.description);
    const [price, setPrice] = useState<number>(data.price);
    const [selectedCategory, setSelectedCategory] = useState<TCategories>();
    const [optionsCategory, setOptionsCategory] = useState<TCategories[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingGetCategories, setLoadingGetCategories] = useState(false);

    const handleClose = () => onClose?.();
    const handleRefresh = () => onRefresh?.();

    const validateForm = () => {
        let isValid = true;

        // if (!capacity || capacity === '' || Number(capacity) <= 0) { setErrorCapacity(true); isValid = false; } else { setErrorCapacity(false); }

        return isValid;
    };

    const submitMenus = () => {
        if (!validateForm()) {
            showToast(ERROR, 'Please fill all required fields');
            return;
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('id', String(data.id));
        formData.append('name', name);
        formData.append('price', Number(price).toString());
        formData.append('category_id', JSON.stringify(selectedCategory?.id));
        formData.append('description', description);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        requestPost<TApiResponse<Void>, typeof formData>(MENUS, formData)
            .then((res) => {
                if (res.success) {
                    showToast(SUCCESS, `${mode === CREATE ? 'Create' : 'Update'} Tables Success`);
                }
            }).finally(() => {
            setLoading(false);
            handleClose();
            handleRefresh()
        })
    }

    const deleteTable = () => {
        setLoading(true)
        const payload = {
            id: data.id,
        }
        requestDelete<TApiResponse<Void>>(`${MENUS}/delete`, payload)
            .then((res) => {
                if (res.success) {
                    showToast(SUCCESS, 'Delete Menus Success');
                }
            }).finally(() => {
            setLoading(false);
            handleClose();
            handleRefresh()
        })
    }

    const getCategories = () => {
        setLoadingGetCategories(true)
        requestGet<TApiResponse<TCategories[]>>('/categories')
            .then((res) => {
                if (res.success) {
                    setOptionsCategory(res.data);
                }
            }).finally(() => {
            setLoadingGetCategories(false);
        })
    }

    useEffect(() => {
        if (mode != VIEW && mode != DELETE) {
            getCategories();
            setSelectedCategory(data.categories)
        }
    }, [data]);


    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const detailMenus = () => {
        const menu : MenusExtended = {
            id: '2.3.1',
            label: data.name,
            route: '/Dashboard/Menus/DetailMenu',
        }
        redirect(menu, data)
    }

    return (
        <React.Fragment>
            <Dialog
                open={openDialog}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {
                        mode === 'delete' ? (
                            <Typography></Typography>
                        ) : (

                            <FormControl sx={{width: '100%'}} component="fieldset">
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
                                    <Box sx={{display: 'flex'}}>
                                        <Input
                                            fullWidth
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <Button
                                            onClick={detailMenus}
                                        >detail</Button>
                                    </Box>

                                    <Autocomplete
                                        disabled={mode === 'view'}
                                        options={optionsCategory}
                                        getOptionLabel={(option) => option.name}
                                        noOptionsText="No categories found"
                                        loading={loading}
                                        value={selectedCategory}
                                        onChange={(_, newValue) => setSelectedCategory(newValue as TCategories)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="select Categories"
                                                variant="outlined"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {loadingGetCategories ? <CircularProgress size={20}/> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />

                                    <TextField
                                        // error={errorCapacity}
                                        value={name}
                                        disabled={mode === 'view'}
                                        onChange={(e) => setName(e.target.value)}
                                        label="Name"
                                        variant="outlined"/>

                                    <TextField
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">Rp </InputAdornment>,
                                            }
                                        }}
                                        type="number"
                                        // error={errorCapacity}
                                        value={price}
                                        disabled={mode === 'view'}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        label="Price"
                                        variant="outlined"/>

                                    <TextField
                                        disabled={mode === VIEW}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        label="Description"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Box>
                            </FormControl>
                        )
                    }

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> {mode === VIEW ? 'Close' : 'Cancel'} </Button>
                    {
                        mode != 'view' && (
                            <>
                                <Button
                                    onClick={mode === DELETE ? deleteTable : submitMenus}
                                    variant='contained'
                                    endIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SendIcon/>}
                                >
                                    {mode === EDIT ? 'Update' :
                                        mode === DELETE ? 'Delete' : 'Submit'}
                                </Button>
                            </>
                        )
                    }
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}