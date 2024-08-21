// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, FormControl, Typography, Select, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Grid } from '../../../node_modules/@mui/material/index';
import React, { useEffect } from 'react';
//register.js import
import PaymentDetail from './PaymentDetail';
import Modal from '@mui/material/Modal';
import CustomTable from 'components/table/CustomTable';
import { usePaymentDeleteStore, usePaymentListStore, usePaymentSearchStore, usePaymentFetchStore } from 'store/paymentStore';
import { useBusinessFetchStore, useBusinessListStore } from 'store/businessStore';
import ExcelDownloadButton from 'components/ExcelDownloadButton';
import { useRef } from 'react';
import { useModalStore, useSelectedListStore } from 'store/cmnStore';
import { useVendorFetchStore } from 'store/vendorStore';
// ============================|| 결제수단 관리 ||============================ //

const Payment = () => {
  const CustomTableRef = useRef(null); // 자식 컴포넌트의 참조 생성
  const { deleteSelectedList } = usePaymentDeleteStore();
  const { modalIsOpen, setModalIsOpen, setModalData } = useModalStore();
  const { selectedList } = useSelectedListStore();

  const { listData, setListData } = usePaymentListStore(); //eslint-disable-line no-unused-vars
  const { paymentSearch, setPaymentSearch } = usePaymentSearchStore(); //eslint-disable-line no-unused-vars
  const { paymentFetch } = usePaymentFetchStore(); //eslint-disable-line no-unused-vars

  const columnDefs = [
    { headerName: '결제수단ID', field: 'payment_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: '사업자ID', field: 'business_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: '거래처ID', field: 'vendor_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: '사업자', field: 'business_name', sortable: true, filter: true, width: '200' },
    { headerName: '거래처', field: 'vendor_name', sortable: true, filter: true, width: '200' },
    { headerName: '과세구분', field: 'tax', sortable: true, filter: true, width: '200' },
    { headerName: '결제수단', field: 'payment_name', sortable: true, filter: true, width: '200' }
  ];
  const headerDefs = ['No', '사업자', '거래처', '과세구분', '결제수단'];
  const excelData = listData.map((data) => {
    return {
      No: listData.indexOf(data) + 1,
      사업자: data.business_name,
      거래처: data.vendor_name,
      과세구분: data.tax,
      결제수단: data.payment_name
    };
  });

  //handleSearch 함수 추가
  const handleSearch = () => {
    paymentFetch();
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
    setPaymentSearch({ ...paymentSearch, business_id: 'all', payment_name: 'default' }); // 초기값 설정
    useBusinessFetchStore.getState().businessFetch('B'); //사업자코드 조회
    useVendorFetchStore.getState().vendorFetch('B'); //거래처 조회
    paymentFetch();
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
                      value={paymentSearch.business_id}
                      onChange={(e) => setPaymentSearch({ ...paymentSearch, business_id: e.target.value })}
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
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>거래처</Typography>
                  <TextField
                    id="vendor_name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={paymentSearch.vendor_name}
                    onChange={(e) => setPaymentSearch({ ...paymentSearch, vendor_name: e.target.value })}
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
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>결제수단</Typography>
                  <Select
                    sx={{ flex: '70%' }}
                    id="payment_name"
                    name="payment_name"
                    value={paymentSearch.payment_name}
                    onChange={(e) =>
                      setPaymentSearch({
                        ...paymentSearch,
                        payment_name: e.target.value
                      })
                    }
                  >
                    <MenuItem value="default">전체</MenuItem>
                    <MenuItem value="신용카드">신용카드</MenuItem>
                    <MenuItem value="현금영수증">현금영수증</MenuItem>
                    <MenuItem value="기타">기타</MenuItem>
                  </Select>
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
          <CustomTable ref={CustomTableRef} type="payment" data={listData} columnDefs={columnDefs} />
        </Grid>
      </Grid>
      <Modal open={modalIsOpen} sx={registerModalStyle}>
        <PaymentDetail />
      </Modal>
    </ComponentSkeleton>
  );
};

export default Payment;
