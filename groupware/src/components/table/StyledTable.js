// StyledTable.js
import { styled } from '@mui/system';
import { Table } from '@mui/material';

const StyledTable = styled(Table)({
  minWidth: 2000,
  borderCollapse: 'collapse',
  '& th, td': {
    padding: '8px'
  }
});

export default StyledTable;
