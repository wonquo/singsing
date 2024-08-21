import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';

const YearCal = ({ value, onChange }) => {
  const [year, setYear] = useState(value ? value.slice(0, 4) : '');
  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setYear(newYear);
    onChange(`${newYear}`);
  };

  return (
    <div>
      <Select sx={{ width: '80px', height: '30px' }} size="small" select label="" value={year} onChange={handleYearChange}>
        {[...Array(new Date().getFullYear() - 2010).keys()].map((index) => (
          <MenuItem key={new Date().getFullYear() - index} value={new Date().getFullYear() - index}>
            {new Date().getFullYear() - index}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default YearCal;
