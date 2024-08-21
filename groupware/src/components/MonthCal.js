import React, { useState } from 'react';
import { TextField, MenuItem } from '@mui/material';

const MonthCal = ({ value, onChange, monthType }) => {
  const [month, setMonth] = useState(value ? value.slice(5, 7) : '');
  const [year, setYear] = useState(value ? value.slice(0, 4) : '');
  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setMonth(newMonth);
    onChange(`${year}-${newMonth}`);
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setYear(newYear);
    onChange(`${newYear}-${month}`);
  };

  return (
    <div>
      <TextField sx={{ width: '50%', backgroundColor: 'white' }} size="small" select label="YYYY" value={year} onChange={handleYearChange}>
        <MenuItem value="">선택</MenuItem>
        {[...Array(new Date().getFullYear() - 2010).keys()].map((index) => (
          <MenuItem key={new Date().getFullYear() - index} value={new Date().getFullYear() - index}>
            {new Date().getFullYear() - index}
          </MenuItem>
        ))}
      </TextField>
      &nbsp;
      <TextField
        sx={{ width: '40%', backgroundColor: 'white' }}
        size="small"
        select
        label={monthType === '전체' ? (month ? 'MM' : '전체') : 'MM'}
        value={month}
        onChange={handleMonthChange}
        style={{ marginRight: '10px' }}
      >
        <MenuItem value="">{monthType ? monthType : '선택'}</MenuItem>
        {[...Array(12).keys()].map((index) => (
          <MenuItem key={index + 1} value={(index + 1).toString().padStart(2, '0')}>
            {(index + 1).toString().padStart(2, '0')}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default MonthCal;
