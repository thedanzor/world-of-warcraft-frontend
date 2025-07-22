import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';

const MRTAutoComplete = (props) => {
  const { onChange, value, placeholder, finalOptions, ...other } = props;

  const updatedOptions = useMemo(() => {
    return [
      ...(finalOptions || []),
      { label: 'pots', id: 'pots' },
      { label: 'defensives', id: 'defensives' },
    ];
  }, [finalOptions]);

  const sanitizedValue = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
      if (typeof item === 'string') {
        return { label: item, id: item };
      }
      return item;
    });
  }, [value]);

  return (
    <Autocomplete
      multiple
      freeSolo
      options={updatedOptions}
      onChange={onChange}
      value={sanitizedValue}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.label || '';
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={null}
          placeholder={placeholder || 'Select players'}
          variant="standard"
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'background.paper',
              borderRadius: 1,
              padding: '12px 18px',
              border: 'none',
              '&:hover': {
                backgroundColor: 'background.paper',
              },
              '&.Mui-focused': {
                backgroundColor: 'background.paper',
              },
              '&:before, &:after': {
                display: 'none',
              },
            },
            '& .MuiInputBase-input': {
              padding: '2px 4px',
              color: 'rgba(255, 255, 255, 0.9)',
            },
            '& .MuiChip-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
            },
          }}
          {...other}
        />
      )}
      sx={{
        '& .MuiAutocomplete-tag': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          color: 'text.primary',
        },
      }}
    />
  );
};

export default MRTAutoComplete; 