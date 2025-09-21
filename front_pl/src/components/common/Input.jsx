import React from 'react';
import { 
  TextField as MuiTextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// TextField personalizado
const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
      },
    },
  },
}));

// Input básico
export const Input = ({ variant = 'outlined', ...props }) => {
  return (
    <StyledTextField
      variant={variant}
      fullWidth
      {...props}
    />
  );
};

// Select personalizado
export const SelectInput = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  error, 
  helperText,
  ...props 
}) => {
  return (
    <FormControl fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        sx={{
          borderRadius: 1,
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

// Autocomplete personalizado
export const AutocompleteInput = ({ 
  label, 
  options = [], 
  value, 
  onChange,
  error,
  helperText,
  ...props 
}) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          variant="outlined"
        />
      )}
      {...props}
    />
  );
};

export default Input;
