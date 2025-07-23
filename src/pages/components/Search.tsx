import {InputAdornment, OutlinedInput} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {type ChangeEvent, type FocusEvent, type KeyboardEvent, useState} from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {Tooltip} from "@mui/material";
import Box from "@mui/material/Box";


interface SearchInputProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onEnter: () => void;
    placeholder?: string;
    fullWidth?: boolean;
    width?: string | number;
}

export default function SearchInput({value, onChange, onBlur, onEnter, placeholder = "Search…", fullWidth = false, width = "25ch",}: SearchInputProps) {
    const [valueChange, setValueChange] = useState<boolean>(false)
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && valueChange) {
            setValueChange(false)
            onEnter();
        }
    };
    const handleSearch = () => {
        if (valueChange) {
            setValueChange(false);
            onEnter();
        }
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValueChange(true);
        onChange(event);
    };
    return (
        <Box
            sx={{width: fullWidth ? "100%" : width, display: "flex", flexDirection: "row", alignItems: "center", gap: 1}}
        >
            <OutlinedInput
                size="small"
                id="search"
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                startAdornment={
                    <InputAdornment position="start" sx={{color: "text.primary"}}>
                        <SearchRoundedIcon fontSize="small"/>
                    </InputAdornment>
                }
                inputProps={{
                    "aria-label": "search",
                }}
            />
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSearch()}
                sx={{flexShrink: 0}}
            >
                Search
            </Button>
            <Tooltip title="Refresh">
                <IconButton onClick={() => onEnter()}>
                    <AutorenewIcon/>
                </IconButton>
            </Tooltip>
        </Box>
    );
}
