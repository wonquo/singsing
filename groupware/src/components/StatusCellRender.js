import React from 'react';
import { Stack } from '@mui/material';

//mui icon Clear Edit Add icon
//component/icon/add, edit, delete png icon

import AddIcon from 'assets/images/icons/add.png';
import EditIcon from 'assets/images/icons/edit.png';
import DeleteIcon from 'assets/images/icons/delete.png';
const StatusCellRenderer = (params) => {
  return (
    <Stack direction="row" spacing={1} marginTop={1}>
      {params.data.cellStatus === 'add' && <img src={AddIcon} alt="Add" style={{ width: '17px', height: '17px', marginTop: '2px' }} />}
      {params.data.cellStatus === 'edit' && <img src={EditIcon} alt="Edit" style={{ width: '17px', height: '17px', marginTop: '2px' }} />}
      {params.data.cellStatus === 'delete' && (
        <img src={DeleteIcon} alt="Delete" style={{ width: '17px', height: '17px', marginTop: '2px' }} />
      )}
    </Stack>
  );
};

export default StatusCellRenderer;
