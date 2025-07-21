import {FormControl, InputAdornment, OutlinedInput} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type {ChangeEvent, FocusEvent, KeyboardEvent} from "react";

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
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onEnter();
        }
    };
    return (
        <FormControl
            variant="outlined"
            sx={{width: fullWidth ? "100%" : width}}
        >
            <OutlinedInput
                size="small"
                id="search"
                value={value}
                onChange={onChange}
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
        </FormControl>
    );
}
