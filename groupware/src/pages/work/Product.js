// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, FormControl, Typography, Select, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Grid } from '../../../node_modules/@mui/material/index';
import React, { useEffect } from 'react';
//register.js import
import ProductDetail from './ProductDetail';
import Modal from '@mui/material/Modal';
import CustomTable from 'components/table/CustomTable';
import { useProductDeleteStore, useProductListStore, useProductSearchStore, useProductFetchStore } from 'store/productStore';
import { useBusinessFetchStore, useBusinessListStore } from 'store/businessStore';
import ExcelDownloadButton from 'components/ExcelDownloadButton';
import { useRef } from 'react';
import { useModalStore, useSelectedListStore } from 'store/cmnStore';
// ============================|| 사용자 관리 ||============================ //

const User = () => {
  const CustomTableRef = useRef(null); // 자식 컴포넌트의 참조 생성
  const { deleteSelectedList } = useProductDeleteStore();
  const { modalIsOpen, setModalIsOpen, setModalData } = useModalStore();
  const { selectedList } = useSelectedListStore();

  const { listData, setListData } = useProductListStore(); //eslint-disable-line no-unused-vars
  const { productSearch, setProductSearch } = useProductSearchStore(); //eslint-disable-line no-unused-vars
  const { productFetch } = useProductFetchStore(); //eslint-disable-line no-unused-vars

  const columnDefs = [
    /*
        product_id 제품 ID 
    business_id 사업자 ID
    product_gubun 제품 구분
    product_code 제품   코드
    product_number  제품 번호
    specification  규격
    unit 단위
    selling_price  판매단가
    product_description  제품 설명
    remarks 비고
    */
    { headerName: '제품ID', field: 'product_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: '사업자ID', field: 'business_id', sortable: true, filter: true, width: '200', hide: true },
    {
      headerName: '사업자',
      field: 'business_name',
      sortable: true,
      filter: true,
      width: '200',
      label: '사업자',
      key: 'product_gubun',
      pinned: 'left'
    },
    {
      headerName: '제품명',
      field: 'product_name',
      sortable: true,
      filter: true,
      width: '200',
      label: '제품구분',
      key: 'product_gubun',
      pinned: 'left'
    },
    { headerName: '제품구분', field: 'product_gubun', sortable: true, filter: true, width: '200', label: '제품구분', key: 'product_gubun' },
    { headerName: '제품코드', field: 'product_code', sortable: true, filter: true, width: '200', label: '제품코드', key: 'product_code' },
    { headerName: '제품번호', field: 'product_number', sortable: true, filter: true, width: '200' },
    { headerName: '규격', field: 'specification', sortable: true, filter: true, width: '200', label: '규격', key: 'specification' },
    { headerName: '단위', field: 'unit', sortable: true, filter: true, width: '200', label: '단위', key: 'unit' },
    { headerName: '판매단가', field: 'selling_price', sortable: true, filter: true, width: '200', label: '판매단가', key: 'selling_price' },
    { headerName: '제품설명', field: 'product_description', sortable: true, filter: true, width: '200' },
    { headerName: '비고', field: 'remarks', sortable: true, filter: true, width: '200', label: '비고', key: 'remarks' }
  ];
  const headerDefs = ['No', '사업자', '제품구분', '제품코드', '제품번호', '규격', '단위', '판매단가', '제품설명', '비고'];
  const excelData = listData.map((data) => {
    return {
      No: listData.indexOf(data) + 1,
      사업자: data.business_name,
      제품구분: data.product_gubun,
      제품코드: data.product_code,
      제품번호: data.product_number,
      규격: data.specification,
      단위: data.unit,
      판매단가: data.selling_price,
      제품설명: data.product_description,
      비고: data.remarks
    };
  });

  const handleSearch = () => {
    productFetch();
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
    productFetch();
    setProductSearch({ ...productSearch, business_id: 'all' });
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
                      value={productSearch.business_id}
                      onChange={(e) => setProductSearch({ ...productSearch, business_id: e.target.value })}
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
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>제품명</Typography>
                  <TextField
                    id="product_name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={productSearch.product_name}
                    onChange={(e) => setProductSearch({ ...productSearch, product_name: e.target.value })}
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
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>제품코드</Typography>
                  <TextField
                    id="product_code"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={productSearch.product_code}
                    onChange={(e) => setProductSearch({ ...productSearch, product_code: e.target.value })}
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
          <CustomTable ref={CustomTableRef} type="product" data={listData} columnDefs={columnDefs} />
        </Grid>
      </Grid>
      <Modal open={modalIsOpen} sx={registerModalStyle}>
        <ProductDetail />
      </Modal>
    </ComponentSkeleton>
  );
};

export default User;
