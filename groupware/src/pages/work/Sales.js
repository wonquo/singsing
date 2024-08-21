// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, FormControl, Typography, Select, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Grid } from '../../../node_modules/@mui/material/index';
import React, { useEffect, useState } from 'react';
import * as FileSaver from 'file-saver';
//template file import
import axios from 'axios';
import templateFile from 'assets/월매출 업로드 양식.xlsx';
//register.js import
import SalesDetail from './SalesDetail';
import Modal from '@mui/material/Modal';
import CustomTable from 'components/table/CustomTable';
import { useSalesDeleteStore, useSalesListStore, useSalesSearchStore, useSalesFetchStore } from 'store/salesStore';
import { useBusinessFetchStore, useBusinessListStore } from 'store/businessStore';
import ExcelDownloadButton from 'components/ExcelDownloadButton';
import ExcelUploadButton from 'components/ExcelUploadButton';
import { useRef } from 'react';
import { useModalStore, useSelectedListStore } from 'store/cmnStore';
import { useVendorFetchStore } from 'store/vendorStore';
import { useProductFetchStore } from 'store/productStore';
import MonthCal from 'components/MonthCal';

// ============================|| 사용자 관리 ||============================ //

const Sales = () => {
  const CustomTableRef = useRef(null); // 자식 컴포넌트의 참조 생성
  const { deleteSelectedList } = useSalesDeleteStore();
  const { modalIsOpen, setModalIsOpen, setModalData } = useModalStore();
  const { selectedList } = useSelectedListStore();

  const { listData, setListData } = useSalesListStore(); //eslint-disable-line no-unused-vars
  const { salesSearch, setSalesSearch } = useSalesSearchStore(); //eslint-disable-line no-unused-vars
  const { salesFetch } = useSalesFetchStore(); //eslint-disable-line no-unused-vars

  const [fromMonthCalValue, setFromMonthCalValue] = useState(new Date());
  const [toMonthCalValue, setToMonthCalValue] = useState(new Date());

  const handelFromMonthCalValue = (value) => {
    setSalesSearch({ ...salesSearch, from_date: value });
    setFromMonthCalValue(value);
  };

  const handelToMonthCalValue = (value) => {
    setSalesSearch({ ...salesSearch, to_date: value });
    setToMonthCalValue(value);
  };

  const columnDefs = [
    { headerName: '결제수단ID', field: 'sales_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'business_id', field: 'business_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'payment_id', field: 'payment_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'vendor_id', field: 'payment_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'product_id', field: 'product_id', sortable: true, filter: true, width: '200', hide: true },
    {
      headerName: '기준월',
      field: 'sales_date',
      sortable: true,
      filter: true,
      width: '150'
    },
    { headerName: '사업자', field: 'business_name', sortable: true, filter: true, width: '150' },
    { headerName: '거래처', field: 'vendor_name', sortable: true, filter: true, width: '180' },
    { headerName: '제품명', field: 'product_name', sortable: true, filter: true, width: '180' },
    { headerName: '과세구분', field: 'tax', sortable: true, filter: true, width: '120' },
    { headerName: '결제수단', field: 'payment_name', sortable: true, filter: true, width: '150' },
    {
      headerName: '단가',
      field: 'unit_price',
      sortable: true,
      filter: true,
      width: '150',
      cellStyle: { textAlign: 'right' }, //#,### 형식
      valueFormatter: (params) => {
        if (params.value === null) return '';
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
      sum: true
    },
    {
      headerName: '수량',
      field: 'qty',
      sortable: true,
      filter: true,
      width: '150',
      cellStyle: { textAlign: 'right' }, //#,### 형식
      valueFormatter: (params) => {
        if (params.value === null) return '';
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
      sum: true
    },
    {
      headerName: '매출액',
      field: 'total_sales',
      sortable: true,
      filter: true,
      width: '150',
      cellStyle: { textAlign: 'right' }, //#,### 형식
      valueFormatter: (params) => {
        if (params.value === null) return '';
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
      sum: true
    },
    //remarks 추가
    { headerName: '비고', field: 'remarks', sortable: true, filter: true, width: '200' }
  ];
  const headerDefs = ['No', '기준월', '사업자', '거래처', '제품명', '과세구분', '결제수단', '단가', '수량', '매출액', '비고'];
  const excelData = listData.map((data) => {
    return {
      No: listData.indexOf(data) + 1,
      기준월: data.sales_date,
      사업자: data.business_name,
      거래처: data.vendor_name,
      제품명: data.product_name,
      과세구분: data.tax,
      결제수단: data.payment_name,
      단가: data.unit_price,
      수량: data.qty,
      매출액: data.total_sales,
      비고: data.remarks
    };
  });

  //handleSearch 함수 추가
  const handleSearch = () => {
    salesFetch();
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
    useBusinessFetchStore.getState().businessFetch('B'); //사업자코드 조회
    useVendorFetchStore.getState().vendorFetch('B'); //거래처 조회
    useProductFetchStore.getState().productFetch('B'); //제품명 조회

    //조회기간 기본 1년 설정 (YYYY-MM)
    const today = new Date();
    const from_date = new Date(today.getFullYear(), today.getMonth() - 10, 1).toISOString().slice(0, 7);
    const to_date = today.toISOString().slice(0, 7);
    handelToMonthCalValue(to_date);
    handelFromMonthCalValue(from_date);

    setSalesSearch({ ...salesSearch, business_id: 'all', from_date: from_date, to_date: to_date });
    salesFetch();
  }, []); // 빈 배열을 전달하여 페이지가 처음 로드될 때만 호출되도록 설정

  const downloadExcelTemplate = () => {
    axios({
      url: templateFile,
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      FileSaver.saveAs(response.data, '월매출 업로드 양식.xlsx');
    });
  };

  const handlePeriodButton = (type) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let startMonth, endMonth;

    switch (type) {
      case 'current':
        startMonth = new Date(currentYear, today.getMonth() + 1).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, today.getMonth() + 1).toISOString().slice(0, 7);
        break;
      case 'previous':
        startMonth = new Date(currentYear, today.getMonth()).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, today.getMonth()).toISOString().slice(0, 7);
        break;
      case 'thisYear':
        startMonth = new Date(currentYear, 1).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, 12).toISOString().slice(0, 7);
        break;
      case 'lastYear':
        startMonth = new Date(currentYear - 1, 1).toISOString().slice(0, 7);
        endMonth = new Date(currentYear - 1, 12).toISOString().slice(0, 7);
        break;
      case 'firstHalf':
        startMonth = new Date(currentYear, 1).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, 6).toISOString().slice(0, 7);
        break;
      case 'secondHalf':
        startMonth = new Date(currentYear, 7).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, 12).toISOString().slice(0, 7);
        break;
      case 'firstQuarter':
        startMonth = new Date(currentYear, 1).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, 3).toISOString().slice(0, 7);
        break;
      case 'secondQuarter':
        startMonth = new Date(currentYear, 4).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, 6).toISOString().slice(0, 7);
        break;
      case 'thirdQuarter':
        startMonth = new Date(currentYear, 7).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, 9).toISOString().slice(0, 7);
        break;
      case 'fourthQuarter':
        startMonth = new Date(currentYear, 10).toISOString().slice(0, 7);
        endMonth = new Date(currentYear, 12).toISOString().slice(0, 7);
        break;
      default:
        startMonth = null;
        endMonth = null;
    }

    setSalesSearch({ ...salesSearch, from_date: startMonth, to_date: endMonth });
    setFromMonthCalValue(startMonth);
    setToMonthCalValue(endMonth);

    salesFetch();
  };

  return (
    <ComponentSkeleton>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <MainCard title="">
            <Grid container spacing={4}>
              <Grid item xs={6} sm={3} md={2.5}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>사업자</Typography>
                  <FormControl variant="outlined" size="small">
                    <Select
                      labelId="business_id"
                      id="business_id"
                      value={salesSearch.business_id}
                      onChange={(e) => setSalesSearch({ ...salesSearch, business_id: e.target.value })}
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
              <Grid item xs={6} sm={3} md={2.5}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>거래처</Typography>
                  <TextField
                    id="vendor_name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={salesSearch.vendor_name}
                    onChange={(e) => setSalesSearch({ ...salesSearch, vendor_name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={3} md={1.5}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>조회기간 </Typography>
                  <MonthCal key={fromMonthCalValue} value={fromMonthCalValue} onChange={(value) => handelFromMonthCalValue(value)} />
                </Box>
              </Grid>
              <Grid item xs={6} sm={3} md={0.3}>
                <Typography sx={{ marginLeft: '-20px', marginTop: '28px', fontWeight: 'bold', fontSize: '20px' }}>~</Typography>
              </Grid>
              <Grid item xs={6} sm={3} md={1.3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '25px', marginLeft: '-30px' }}>
                  <MonthCal key={toMonthCalValue} value={toMonthCalValue} onChange={(value) => handelToMonthCalValue(value)} />
                </Box>
              </Grid>
              <Grid item xs={6} sm={3} md={2.5} />
              <Grid item xs={6} sm={3} md={1}>
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
              <Grid item xs={6} sm={3} md={5}></Grid>
              <Grid item xs={6} sm={3} md={1}>
                {/* 조회기간 선택 버튼 
                   버튼 : 당월, 전월, 올해, 전년, 상반기, 하반기, 1분기, 2분기, 3분기, 4분기
                   위 버튼을 클릭하면 조회기간이 변경되어 조회되도록 함
                */}
                <Box
                  sx={{
                    display: 'flex',
                    marginTop: '-23px',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  {/*아래 버튼이 모두 크기가 일정한 문제가 발생한다
                     상반/기 하반/기 이렇게 줄바꿈이 발생하는 문제가 있음
                      이를 해결하기 위해 width를 80px로 지정하여 해결하려했는데 width가 변경되지 않음
                      
                  
                  */}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('current')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px' }}
                  >
                    당월
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('previous')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px' }}
                  >
                    전월
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('thisYear')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px' }}
                  >
                    올해
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('lastYear')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px' }}
                  >
                    전년
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('firstHalf')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px', minWidth: '75px' }}
                  >
                    상반기
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('secondHalf')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px', minWidth: '75px' }}
                  >
                    하반기
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('firstQuarter')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px', minWidth: '70px' }}
                  >
                    1분기
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('secondQuarter')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px', minWidth: '70px' }}
                  >
                    2분기
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('thirdQuarter')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px', minWidth: '70px' }}
                  >
                    3분기
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePeriodButton('fourthQuarter')}
                    sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px', minWidth: '70px' }}
                  >
                    4분기
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </MainCard>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Box>
              <ExcelDownloadButton data={excelData} headers={headerDefs} />
              <ExcelUploadButton onUpload={(data) => console.log(data)} key1="sales" />
              <Button
                variant="contained"
                component="span"
                sx={{
                  marginRight: '10px',
                  fontWeight: 'bold',
                  height: '32px',
                  backgroundColor: '#808080',
                  color: 'white'
                }}
                onClick={downloadExcelTemplate}
              >
                Template Download
              </Button>
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
          <CustomTable ref={CustomTableRef} type="sales" data={listData} columnDefs={columnDefs} />
        </Grid>
      </Grid>
      <Modal open={modalIsOpen} sx={registerModalStyle}>
        <SalesDetail ref={CustomTableRef} />
      </Modal>
    </ComponentSkeleton>
  );
};

export default Sales;
