// StyledHeadTableCell.js
import { styled } from '@mui/system';
import { TableCell } from '@mui/material';

const StyledHeadTableCell = styled(TableCell)({
  backgroundColor: '#f9f9f9', // #f5f5f5 보다 연한 회색 배경색은?
  //#f5f5f5 보다 연한 회색 배경색은?

  fontSize: '15px',
  fontWeight: 'bold',
  position: 'sticky',
  top: 0,
  zIndex: 1
});

export default StyledHeadTableCell;
