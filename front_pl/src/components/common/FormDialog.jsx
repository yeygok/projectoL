import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Autocomplete,
  Chip,
  Switch,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Close as CloseIcon } from '@mui/icons-material';
import { es } from 'date-fns/locale/es';

const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  fields = [],
  initialData = {},
  loading = false,
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(initialData);
      setErrors({});
      setTouched({});
    }
  }, [open, initialData]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    validateField(fieldName);
  };

  const validateField = (fieldName) => {
    const field = fields.find(f => f.name === fieldName);
    const value = formData[fieldName];
    let error = '';

    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      error = `${field.label} es requerido`;
    } else if (field.validation) {
      const validationResult = field.validation(value, formData);
      if (validationResult !== true) {
        error = validationResult;
      }
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return !error;
  };

  const handleSubmit = () => {
    // Validar todos los campos
    let isValid = true;
    const newTouched = {};
    
    fields.forEach(field => {
      newTouched[field.name] = true;
      if (!validateField(field.name)) {
        isValid = false;
      }
    });
    
    setTouched(newTouched);

    if (isValid) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = touched[field.name] && errors[field.name];
    const commonProps = {
      fullWidth: true,
      error: !!error,
      helperText: error,
      disabled: loading,
      onBlur: () => handleBlur(field.name),
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            multiline={field.multiline}
            rows={field.rows}
            InputProps={field.InputProps}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        );

      case 'autocomplete':
        return (
          <Autocomplete
            options={field.options || []}
            getOptionLabel={(option) => option.label || option}
            value={field.options?.find(opt => opt.value === value) || null}
            onChange={(event, newValue) => {
              handleChange(field.name, newValue?.value || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...commonProps}
                label={field.label}
              />
            )}
            disabled={loading}
          />
        );

      case 'multiselect':
        return (
          <Autocomplete
            multiple
            options={field.options || []}
            getOptionLabel={(option) => option.label || option}
            value={field.options?.filter(opt => value.includes?.(opt.value)) || []}
            onChange={(event, newValue) => {
              handleChange(field.name, newValue.map(v => v.value));
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.label}
                  {...getTagProps({ index })}
                  key={option.value}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                {...commonProps}
                label={field.label}
              />
            )}
            disabled={loading}
          />
        );

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                disabled={loading}
              />
            }
            label={field.label}
          />
        );

      case 'datetime':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DateTimePicker
              label={field.label}
              value={value ? new Date(value) : null}
              onChange={(newValue) => handleChange(field.name, newValue)}
              renderInput={(params) => (
                <TextField {...params} {...commonProps} />
              )}
              disabled={loading}
            />
          </LocalizationProvider>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label={field.label}
              value={value ? new Date(value) : null}
              onChange={(newValue) => handleChange(field.name, newValue)}
              renderInput={(params) => (
                <TextField {...params} {...commonProps} />
              )}
              disabled={loading}
            />
          </LocalizationProvider>
        );

      case 'time':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <TimePicker
              label={field.label}
              value={value ? new Date(`1970-01-01T${value}`) : null}
              onChange={(newValue) => {
                if (newValue) {
                  const timeString = newValue.toTimeString().split(' ')[0];
                  handleChange(field.name, timeString);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} {...commonProps} />
              )}
              disabled={loading}
            />
          </LocalizationProvider>
        );

      case 'custom':
        return field.render ? field.render({
          value,
          onChange: (newValue) => handleChange(field.name, newValue),
          error: !!error,
          helperText: error,
          disabled: loading,
        }) : null;

      default:
        return (
          <TextField
            {...commonProps}
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: { minHeight: '300px' }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={3}>
            {fields.map((field) => (
              <Grid item xs={12} sm={field.sm || 12} md={field.md || field.sm || 12} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (initialData?.id ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
