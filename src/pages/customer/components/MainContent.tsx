import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import {styled} from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import {useEffect, useState} from "react";
import type {Menus, TApiResponse} from "../../../type/type.ts";
import {requestGet} from "../../../api/api.ts";
import Loader from "../../components/Loader.tsx";

const cardData = [
    {
        img: 'https://picsum.photos/800/450?random=1',
        tag: 'Engineering',
        title: 'Revolutionizing software development with cutting-edge tools',
        description:
            'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
        authors: [
            {name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg'},
            {name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg'},
        ],
    },
    {
        img: 'https://picsum.photos/800/450?random=2',
        tag: 'Product',
        title: 'Innovative product features that drive success',
        description:
            'Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.',
        authors: [{name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg'}],
    },
    {
        img: 'https://picsum.photos/800/450?random=3',
        tag: 'Design',
        title: 'Designing for the future: trends and insights',
        description:
            'Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.',
        authors: [{name: 'Kate Morrison', avatar: '/static/images/avatar/7.jpg'}],
    }
];

const SyledCard = styled(Card)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.background.paper,
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

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

function Author({authors}: { authors: { name: string; avatar: string }[] }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
            }}
        >
            <Box
                sx={{display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center'}}
            >
                <AvatarGroup max={3}>
                    {authors.map((author, index) => (
                        <Avatar
                            key={index}
                            alt={author.name}
                            src={author.avatar}
                            sx={{width: 24, height: 24}}
                        />
                    ))}
                </AvatarGroup>
                <Typography variant="caption">
                    {authors.map((author) => author.name).join(', ')}
                </Typography>
            </Box>
            <Typography variant="caption">July 14, 2021</Typography>
        </Box>
    );
}

export function Search() {
    return (
        <FormControl sx={{width: {xs: '100%', md: '25ch'}}} variant="outlined">
            <OutlinedInput
                size="small"
                id="search"
                placeholder="Search…"
                sx={{flexGrow: 1}}
                startAdornment={
                    <InputAdornment position="start" sx={{color: 'text.primary'}}>
                        <SearchRoundedIcon fontSize="small"/>
                    </InputAdornment>
                }
                inputProps={{
                    'aria-label': 'search',
                }}
            />
        </FormControl>
    );
}

export default function MainContent() {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    const handleClick = () => {
        console.info('You clicked the filter chip.');
    };

    const [menus, setMenus] = useState<Menus[]>([]);
    useEffect(() => {
        setLoading(true);
        requestGet<TApiResponse<Menus[]>>('/menus')
            .then((res) => setMenus(res.data))
            .finally(() => {
                setLoading(false);
            });
    }, []);
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <Loader show={loading}/>
            <Box
                sx={{
                    display: {xs: 'flex', sm: 'none'},
                    flexDirection: 'row',
                    gap: 1,
                    width: {xs: '100%', md: 'fit-content'},
                    overflow: 'auto',
                }}
            >
                <Search/>
                <IconButton size="small" aria-label="RSS feed">
                    <RssFeedRoundedIcon/>
                </IconButton>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column-reverse', md: 'row'},
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: {xs: 'start', md: 'center'},
                    gap: 4,
                    overflow: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        gap: 3,
                        overflow: 'auto',
                    }}
                >
                    <Chip onClick={handleClick} size="medium" label="All categories"/>
                    <Chip
                        onClick={handleClick}
                        size="medium"
                        label="Company"
                        sx={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    />
                    <Chip
                        onClick={handleClick}
                        size="medium"
                        label="Product"
                        sx={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    />
                    <Chip
                        onClick={handleClick}
                        size="medium"
                        label="Design"
                        sx={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    />
                    <Chip
                        onClick={handleClick}
                        size="medium"
                        label="Engineering"
                        sx={{
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: {xs: 'none', sm: 'flex'},
                        flexDirection: 'row',
                        gap: 1,
                        width: {xs: '100%', md: 'fit-content'},
                        overflow: 'auto',
                    }}
                >
                    <Search/>
                    <IconButton size="small" aria-label="RSS feed">
                        <RssFeedRoundedIcon/>
                    </IconButton>
                </Box>
            </Box>
            <Grid container spacing={2} columns={12}>
                {menus.map((menu, index) => (
                    <Grid key={menu.id ?? index} size={{xs: 12, md: 4}}>
                        <SyledCard
                            variant="outlined"
                            onFocus={() => handleFocus(2)}
                            onBlur={handleBlur}
                            tabIndex={0}
                            className={focusedCardIndex === 2 ? 'Mui-focused' : ''}
                            sx={{height: '100%'}}
                        >
                            <CardMedia
                                component="img"
                                alt={menu.name}
                                image={menu.image_url}
                                sx={{
                                    height: {sm: 'auto', md: '50%'},
                                    aspectRatio: {sm: '16 / 9', md: ''},
                                }}
                            />
                            <SyledCardContent>
                                <Typography gutterBottom variant="caption" component="div">
                                    {cardData[2].tag}
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    {cardData[2].title}
                                </Typography>
                                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                    {cardData[2].description}
                                </StyledTypography>
                            </SyledCardContent>
                            <Author authors={cardData[2].authors}/>
                        </SyledCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
