import React from 'react';
import { Button, Stack } from '@mui/material';
//useCommonCodeTransactionStore
import { useCommonCodeTransactionStore } from 'store/commonCodeStore';

const ActionCellRenderer = (params) => {
  const handleUpdate = () => {
    const data = params.data;
    //detail id 가 없을 경우
    if (data.detail_id === undefined) {
      if (data.code === '') {
        alert('분류코드를 입력해주세요.');
        return;
      }
      if (data.name === '') {
        alert('분류명을 입력해주세요.');
        return;
      }
      if (data.description === '') {
        alert('설명을 입력해주세요.');
        return;
      }

      if (window.confirm('수정하시겠습니까?')) {
        useCommonCodeTransactionStore.getState().commonCodeTransaction('master', 'update', data);
      }
    }
  };

  const handleDelete = () => {
    const data = params.data;
    //detail id 가 없을 경우detail_id
    if (data.detail_id === undefined) {
      if (window.confirm('삭제하시겠습니까?')) {
        useCommonCodeTransactionStore.getState().commonCodeTransaction('master', 'delete', data.master_id);
      }
    } else {
      if (window.confirm('삭제하시겠습니까?')) {
        useCommonCodeTransactionStore.getState().commonCodeTransaction('detail', 'delete', data.detail_id);
      }
    }
  };

  return (
    <Stack direction="row" spacing={1} marginTop={0.5}>
      <Button size="small" variant="contained" data-action="update" onClick={handleUpdate}>
        Update
      </Button>
      <Button size="small" variant="outlined" data-action="cancel" onClick={handleDelete}>
        Delete
      </Button>
    </Stack>
  );
};

export default ActionCellRenderer;
