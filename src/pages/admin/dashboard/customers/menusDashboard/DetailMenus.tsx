import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import type {TApiResponse, TCategories, TImages, TMenus, Void} from "@/type/type.ts";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import {Autocomplete, CircularProgress, InputAdornment} from "@mui/material";
import TextField from "@mui/material/TextField";
import {CREATE, DELETE, EDIT, SUCCESS, VIEW} from "@/constant";
import * as React from "react";
import {showToast} from "@/pages/util/toast.ts";
import {requestGet, requestPost} from "@/api/api.ts";
import {MENUS} from "@/api/url.ts";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {useCategoryStore} from "@/store/useCategoryStore.ts";
import ButtonProgress from "@/pages/components/button/ButtonProgress.tsx";
import Loader from "@/pages/components/Loader.tsx";
import {styled} from "@mui/material/styles";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
type DetailMenusProps = {
    mode: string,
    data: TMenus
    handleBack: () => void
}

export const DetailMenus = (props: DetailMenusProps) => {
    const categories = useCategoryStore((state) => state)
    const data : TMenus = props.data

    const primaryImage = data.images ? data.images.find(image => image.is_primary) : null;

    const [name, setName] = useState<string>(data.name);
    const [description, setDescription] = useState<string>(data.description);
    const [price, setPrice] = useState<number>(data.price);
    const [selectedCategory, setSelectedCategory] = useState<TCategories>(data.categories);

    const [loading, setLoading] = useState(false);
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [loadingGetCategories, setLoadingGetCategories] = useState(false);

    const [images, setImages] = useState<TImages[]>(data.images || []);
    const [deleteImages, setDeleteImages] = useState<TImages[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [uploadImage, setUploadImage] = useState<File[]>([]);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const files = Array.from(event.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));

        setPreviewImages((prev) => [...prev, ...previews]);
        setUploadImage((prev) => [...prev, ...files]);
    };


    const submitMenus = () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('id', String(data.id));
        formData.append('name', name);
        formData.append('price', Number(price).toString());
        formData.append('category_id', JSON.stringify(selectedCategory?.id));
        formData.append('description', description);
        uploadImage.forEach((file) => {
            formData.append("images[]", file);
        });

        requestPost<TApiResponse<Void>, typeof formData>(MENUS, formData)
            .then((res) => {
                if (res.success) {
                    showToast(SUCCESS, `${props.mode === CREATE ? 'Create' : 'Update'} Menu Success`);
                }
            }).finally(() => {
            setLoading(false);
            getDetailMenus(data.id)
        })
    }

    const getCategories = () => {
        setLoadingGetCategories(true)
        requestGet<TApiResponse<TCategories[]>>('/categories')
            .then((res) => {
                if (res.success) {
                    categories.setCategory(res.data)
                }
            }).finally(() => {
            setLoadingGetCategories(false);
        })
    }

    const getDetailMenus = (id: number) => {
        setLoadingRefresh(true)
        requestGet<TApiResponse<TMenus>>(`${MENUS}/id`, {id: id})
            .then((res) => {
                if (res.success) {
                    setName(res.data.name);
                    setDescription(res.data.description);
                    setPrice(res.data.price);
                    setSelectedCategory(res.data.categories);
                    setImages(res.data.images);
                }
            }).finally(() => {
            setLoadingRefresh(false);
        })
    }

    useEffect(() => {
        if (categories.data.length === 0) {
            getCategories();
        }
    }, []);

    const handleBack = () => props.handleBack();
    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1}}>
                <Typography variant="h6" component="div">test</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 2, position: 'relative' }}>
                <Loader size="small" show={loadingRefresh}/>
                <Grid size={6}>
                    <Card sx={{height: '100%'}}>
                        <Box>
                            <Typography marginBottom={2} variant="h6" component="div">Primary Image</Typography>
                            {
                                primaryImage ? (
                                    <img
                                        src={primaryImage?.image_url}
                                        alt="Menu"
                                        style={{width: 100, height: 100, objectFit: 'cover', borderRadius: '4px'}}
                                    />
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100, height: 100, flexDirection: 'column' }}>
                                        <Typography variant="caption">No Primary Image</Typography>
                                    </Box>
                                )
                            }

                        </Box>
                        <Box sx={{mt: 6}}>
                            <Typography marginBottom={2} variant="h6" component="div">All Images</Typography>
                            <Grid marginBottom={4} container spacing={4}>
                                {
                                    (images && images.length > 0)  ? (
                                        <>
                                            {images.map((image) => (
                                                <Grid key={image.id}>
                                                    <Box sx={{position: 'relative'}}>
                                                        <img
                                                            src={image.image_url}
                                                            alt="Menu"
                                                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                        <IconButton sx={{position: 'absolute', top: 2, right: 4, border: 'none'}} aria-label="delete">
                                                            <ClearIcon color='error' />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </>
                                    ) : (
                                        <></>
                                    )
                                }
                                {
                                    previewImages.length > 0 ? (
                                        <>
                                            {previewImages.map((src, index) => (
                                                <Grid key={`preview-${index}`}>
                                                    <img
                                                        src={src}
                                                        alt="Preview"
                                                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                </Grid>
                                            ))}
                                        </>
                                    ) : (
                                        <></>
                                    )
                                }
                                {
                                    (images?.length === 0 && previewImages?.length === 0) && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100, height: 100, flexDirection: 'column' }}>
                                            <Typography variant="caption">No Images</Typography>
                                        </Box>
                                    )
                                }
                            </Grid>
                            {
                                props.mode !== VIEW && (
                                    <Button
                                        component="label"
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload image
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={handleUpload}
                                            multiple
                                        />
                                    </Button>
                                )
                            }
                        </Box>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card>
                        <CardContent>
                            <FormControl sx={{width: '100%'}} component="fieldset">
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
                                    <Autocomplete
                                        disabled={props.mode === 'view'}
                                        options={categories.data}
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
                                        disabled={props.mode === 'view'}
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
                                        disabled={props.mode === 'view'}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        label="Price"
                                        variant="outlined"/>

                                    <TextField
                                        disabled={props.mode === VIEW}
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
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2, mb: 2, width: '100%', alignItems: 'center'}}>
                <Button variant={props.mode === VIEW ? 'contained' : 'text'} onClick={handleBack}> Back </Button>
                {
                    props.mode != 'view' && (
                        <>
                            <ButtonProgress label={props.mode === EDIT ? 'Update' :
                                props.mode === DELETE ? 'Delete' : 'Submit'} actionClick={submitMenus} loading={loading}/>
                        </>
                    )
                }
            </Box>
        </Box>
    )
}