// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, FormControl, Typography, Select, MenuItem } from '@mui/material';
import { Grid } from '../../../node_modules/@mui/material/index';
import React, { useEffect } from 'react';
//register.js import
import Register from './UserRegister/UserRegister';
import Modal from '@mui/material/Modal';
import CustomTable from 'components/table/CustomTable';
import { useUserDeleteStore, useUserListStore, useUserSearchStore, useUserFetchStore } from 'store/userStore';
import { useRef } from 'react';
import { useModalStore, useSelectedListStore } from 'store/cmnStore';

// ============================|| 사용자 관리 ||============================ //

const User = () => {
  //사용자 추가(UserRegister) 팝업

  const CustomTableRef = useRef(null); // 자식 컴포넌트의 참조 생성
  const { deleteSelectedList } = useUserDeleteStore();
  const { modalIsOpen, setModalIsOpen, setModalData } = useModalStore();
  const { selectedList, setListData } = useSelectedListStore(); //eslint-disable-line no-unused-vars
  const { userFetch } = useUserFetchStore();

  const { listData } = useUserListStore(); //리스트 조회 데이터
  const { userSearch, setUserSearch } = useUserSearchStore(); //검색어

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: '250' },
    { headerName: '이름', field: 'name', sortable: true, filter: true, width: '250' },
    { headerName: '권한', field: 'auth', sortable: true, filter: true, width: '400' }
  ];

  //handleSearch 함수 추가
  const handleSearch = () => {
    // 검색어를 가져오는 함수 호출
    userFetch();
  };

  const handleClickOpen = () => {
    CustomTableRef.current.deleteSelectedData();
    setModalData([]);
    setModalIsOpen(true);
  };
  const handleClickUpdateOpen = () => {
    if (selectedList.length === 0) {
      alert('수정할 데이터를 선택하세요.');
      return;
    } else if (selectedList.length > 1) {
      alert('수정할 데이터를 하나만 선택하세요.');
      return;
    }
    setModalIsOpen(true);
  };

  const handleDelete = () => {
    if (selectedList.length === 0) {
      alert('수정할 데이터를 선택하세요.');
      return;
    }
    deleteSelectedList();
  };
  const registerModalStyle = {
    //MuiBox-root css-90q4tt 보이지 않게
    '& .css-90q4tt': {
      display: 'none'
    },
    // css-10d1a0h-MuiButtonBase-root 보이지 않게
    '& .css-10d1a0h-MuiButtonBase-root': {
      display: 'none'
    },
    //MuiButtonBase-root css-1b47e06 보이지 않게
    '& .css-1b47e06-MuiButtonBase-root': {
      display: 'none'
    }
  };

  useEffect(() => {
    // 페이지가 마운트될 때 사용자 데이터를 가져오는 함수 호출
    userFetch();
  }, []); // 빈 배열을 전달하여 페이지가 처음 로드될 때만 호출되도록 설정

  return (
    <ComponentSkeleton>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <MainCard title="">
            <Grid container spacing={10}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>ID</Typography>
                  <TextField
                    id="id"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={userSearch.id}
                    onChange={(e) => setUserSearch({ ...userSearch, id: e.target.value })}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>이름</Typography>
                  <TextField
                    id="name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={userSearch.name}
                    onChange={(e) => setUserSearch({ ...userSearch, name: e.target.value })}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>권한</Typography>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      labelId="auth-label"
                      id="auth"
                      value={userSearch.auth}
                      onChange={(e) => setUserSearch({ ...userSearch, auth: e.target.value })}
                    >
                      <MenuItem value="">전체</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={1.5}></Grid>
              <Grid item xs={6} sm={6} md={1}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '23px'
                  }}
                >
                  <Button variant="contained" color="primary" onClick={handleSearch} sx={{ width: '120px', fontWeight: 'bold' }}>
                    SEARCH
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </MainCard>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px' }}
            >
              추가
            </Button>
            <Button onClick={handleClickUpdateOpen} variant="contained" color="primary" sx={{ fontWeight: 'bold', height: '32px' }}>
              수정
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDelete}
              sx={{ marginLeft: '10px', fontWeight: 'bold', height: '32px' }}
            >
              삭제
            </Button>
          </Box>
          <CustomTable ref={CustomTableRef} type="user" data={listData} columnDefs={columnDefs} />
        </Grid>
      </Grid>
      <Modal open={modalIsOpen} sx={registerModalStyle}>
        <Register />
      </Modal>
    </ComponentSkeleton>
  );
};

export default User;
