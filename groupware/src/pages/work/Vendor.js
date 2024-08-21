// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, FormControl, Typography, Select, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Grid } from '../../../node_modules/@mui/material/index';
import React, { useEffect } from 'react';
//register.js import
import VendorDetail from './VendorDetail';
import Modal from '@mui/material/Modal';
import CustomTable from 'components/table/CustomTable';
import { useVendorDeleteStore, useVendorListStore, useVendorSearchStore, useVendorFetchStore } from 'store/vendorStore';
import { useBusinessFetchStore, useBusinessListStore } from 'store/businessStore';
import ExcelDownloadButton from 'components/ExcelDownloadButton';
import { useRef } from 'react';
import { useModalStore, useSelectedListStore } from 'store/cmnStore';
// ============================|| 사용자 관리 ||============================ //

const User = () => {
  const CustomTableRef = useRef(null); // 자식 컴포넌트의 참조 생성
  const { deleteSelectedList } = useVendorDeleteStore();
  const { modalIsOpen, setModalIsOpen, setModalData } = useModalStore();
  const { selectedList } = useSelectedListStore();

  const { listData, setListData } = useVendorListStore(); //eslint-disable-line no-unused-vars
  const { vendorSearch, setVendorSearch } = useVendorSearchStore(); //eslint-disable-line no-unused-vars
  const { vendorFetch } = useVendorFetchStore(); //eslint-disable-line no-unused-vars

  const columnDefs = [
    { headerName: '거래처ID', field: 'vendor_id', sortable: true, filter: true, width: '200', hide: true },
    {
      headerName: '사업자',
      field: 'business_name',
      sortable: true,
      filter: true,
      width: '200',
      label: '사업자',
      key: 'business_name',
      pinned: 'left'
    },
    {
      headerName: '거래처명',
      field: 'vendor_name',
      sortable: true,
      filter: true,
      width: '280',
      label: '거래처명',
      key: 'vendor_name',
      pinned: 'left'
    },
    { headerName: '대표자', field: 'ceo', sortable: true, filter: true, width: '150', label: '대표자', key: 'ceo' },
    {
      headerName: '사업자번호',
      field: 'business_number',
      sortable: true,
      filter: true,
      width: '200',
      label: '사업자번호',
      key: 'business_number'
    },
    { headerName: '전화번호', field: 'phone_number', sortable: true, filter: true, width: '200', label: '전화번호', key: 'phone_number' },
    { headerName: '팩스번호', field: 'fax_number', sortable: true, filter: true, width: '200', label: '팩스번호', key: 'fax_number' },
    { headerName: '담당자', field: 'contact_person', sortable: true, filter: true, width: '150', label: '담당자', key: 'contact_person' },
    { headerName: '연락처', field: 'contact_number', sortable: true, filter: true, width: '200', label: '연락처', key: 'contact_number' },
    { headerName: '업태', field: 'business_type', sortable: true, filter: true, width: '200', label: '업태', key: 'business_type' },
    { headerName: '종목', field: 'business_items', sortable: true, filter: true, width: '200', label: '종목', key: 'business_items' },
    { headerName: '주소', field: 'address', sortable: true, filter: true, width: '200', label: '주소', key: 'address' },
    { headerName: '비고', field: 'remarks', sortable: true, filter: true, width: '200', label: '비고', key: 'remark' }
  ];
  const headerDefs = ['No', '사업자', '거래처명', '대표자', '전화번호', '팩스번호', '담당자', '연락처', '업태', '종목', '주소', '비고'];
  const excelData = listData.map((data) => {
    return {
      No: listData.indexOf(data) + 1,
      사업자: data.business_name,
      거래처명: data.vendor_name,
      대표자: data.ceo,
      사업자번호: data.business_number,
      전화번호: data.phone_number,
      팩스번호: data.fax_number,
      담당자: data.contact_person,
      연락처: data.contact_number,
      업태: data.business_type,
      종목: data.business_items,
      주소: data.address,
      비고: data.remark
    };
  });

  //handleSearch 함수 추가
  const handleSearch = () => {
    vendorFetch();
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

    //삭제하시겠습니까? 확인 메시지 추가
    if (!window.confirm('삭제하시겠습니까?')) {
      return false;
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
    vendorFetch();
    setVendorSearch({ ...vendorSearch, business_id: 'all' }); //사업자코드 조회
    useBusinessFetchStore.getState().businessFetch('B'); //사업자코드 조회
  }, []); // 빈 배열을 전달하여 페이지가 처음 로드될 때만 호출되도록 설정

  return (
    <ComponentSkeleton>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <MainCard title="">
            <Grid container spacing={10}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>사업자</Typography>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      labelId="business_id"
                      id="business_id"
                      value={vendorSearch.business_id}
                      onChange={(e) => setVendorSearch({ ...vendorSearch, business_id: e.target.value })}
                    >
                      <MenuItem value="all">전체</MenuItem>
                      {useBusinessListStore.getState().listData.map((data) => (
                        <MenuItem key={data.business_id} value={data.business_id}>
                          {data.business_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>거래처명</Typography>
                  <TextField
                    id="name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={vendorSearch.vendor_name}
                    onChange={(e) => setVendorSearch({ ...vendorSearch, vendor_name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>대표자</Typography>
                  <TextField
                    id="name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={vendorSearch.ceo}
                    onChange={(e) => setVendorSearch({ ...vendorSearch, ceo: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Box>
              <ExcelDownloadButton data={excelData} headers={headerDefs} />
            </Box>
            <Box>
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
          </Box>
          <CustomTable ref={CustomTableRef} type="vendor" data={listData} columnDefs={columnDefs} />
        </Grid>
      </Grid>
      <Modal open={modalIsOpen} sx={registerModalStyle}>
        <VendorDetail />
      </Modal>
    </ComponentSkeleton>
  );
};

export default User;
