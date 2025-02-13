import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Input = ({ name, half, handleChange, autoFocus, type, label, handleShowPassword, value }) => {
    return (
        <Grid item xs={12} sm={half ? 6 : 12}>
            <TextField
                name={name}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
                label={label}
                autoFocus={autoFocus}
                type={type}
                value={value || ''}
                InputProps={name === 'password' || name === 'confirmPassword' ? {
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton
                                onClick={handleShowPassword}
                                aria-label={type === "password" ? "show password" : "hide password"}
                            >
                                {type === "password" ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                } : null}
            />
        </Grid>
    );
};

export default Input;