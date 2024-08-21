// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, FormControl, Typography, Select, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Grid } from '../../../node_modules/@mui/material/index';
import React, { useEffect } from 'react';
//register.js import
import ExpenseDetail from './ExpenseDetail';
import Modal from '@mui/material/Modal';
import CustomTable from 'components/table/CustomTable';
import {
  useExpenseDeleteStore,
  useExpenseListStore,
  useExpenseSearchStore,
  useExpenseFetchStore,
  useExpenseVendorStore
} from 'store/expenseStore';
import ExcelDownloadButton from 'components/ExcelDownloadButton';
import { useRef } from 'react';
import { useModalStore, useSelectedListStore } from 'store/cmnStore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ============================|| 결제수단 관리 ||============================ //

const Expense = () => {
  const CustomTableRef = useRef(null); // 자식 컴포넌트의 참조 생성
  const { deleteSelectedList } = useExpenseDeleteStore();
  const { modalIsOpen, setModalIsOpen, setModalData } = useModalStore();
  const { selectedList } = useSelectedListStore();

  const { listData, setListData } = useExpenseListStore(); //eslint-disable-line no-unused-vars
  const { expenseSearch, setExpenseSearch } = useExpenseSearchStore(); //eslint-disable-line no-unused-vars
  const { expenseFetch } = useExpenseFetchStore(); //eslint-disable-line no-unused-vars

  const columnDefs = [
    { headerName: '경비ID', field: 'expense_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: '거래처CODE', field: 'expense_vendor_code', sortable: true, filter: true, width: '200', hide: true },
    { headerName: '지출일자', field: 'expense_date', sortable: true, filter: true, width: '200' },
    { headerName: '거래처', field: 'expense_vendor_name', sortable: true, filter: true, width: '200' },
    { headerName: '지출목적', field: 'expense_purpose', sortable: true, filter: true, width: '200' },
    { headerName: '지출내용', field: 'expense_content', sortable: true, filter: true, width: '200' },
    { headerName: '담당자', field: 'manager', sortable: true, filter: true, width: '200' },
    {
      headerName: '지출금액',
      field: 'expense_amount',
      sortable: true,
      filter: true,
      width: '200',
      type: 'numericColumn',
      sum: true,

      valueFormatter: (params) => {
        if (params.value === null) return '';
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    },

    //비고
    { headerName: '비고', field: 'remarks', sortable: true, filter: true, width: '300' }
  ];
  const headerDefs = ['No', '지출일자', '거래처', '지출목적', '지출내용', '담당자', '지출금액', '비고'];
  const excelData = listData.map((data) => {
    return {
      No: listData.indexOf(data) + 1,
      지출일자: data.expense_date,
      거래처: data.expense_vendor_name,
      지출목적: data.expense_purpose,
      지출내용: data.expense_content,
      담당자: data.manager,
      지출금액: data.expense_amount,
      비고: data.remarks
    };
  });

  //handleSearch 함수 추가
  const handleSearch = () => {
    expenseFetch();
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

  const registerModalStyle = {};

  useEffect(() => {
    //조회조건 초기화
    setExpenseSearch({
      expense_vendor_name: '',
      //from_date 는 3개월 전
      from_date: dayjs().subtract(3, 'month'),
      to_date: dayjs()
    });
    useExpenseVendorStore.getState().fetchExpenseVendorList(); //거래처 조회(모달창에서 사용)
    expenseFetch();
  }, []); // 빈 배열을 전달하여 페이지가 처음 로드될 때만 호출되도록 설정

  const handlePeriodButton = (type) => {
    const today = dayjs();
    let startDate, endDate;
    switch (type) {
      case 'current':
        startDate = dayjs(today).startOf('month');
        endDate = dayjs(today).endOf('month');
        break;
      case 'previous':
        startDate = dayjs(today).subtract(1, 'month').startOf('month');
        endDate = dayjs(today).subtract(1, 'month').endOf('month');
        break;
      case 'thisYear':
        startDate = dayjs(today).startOf('year');
        endDate = dayjs(today).endOf('year');
        break;
      case 'lastYear':
        startDate = dayjs(today).subtract(1, 'year').startOf('year');
        endDate = dayjs(today).subtract(1, 'year').endOf('year');
        break;
      case 'firstHalf':
        startDate = dayjs(today).startOf('year');
        endDate = dayjs(today).startOf('year').add(6, 'month').endOf('month');
        break;
      case 'secondHalf':
        startDate = dayjs(today).startOf('year').add(6, 'month');
        endDate = dayjs(today).endOf('year');
        break;
      case 'firstQuarter':
        startDate = dayjs(today).startOf('year');
        endDate = dayjs(today).startOf('year').add(3, 'month').endOf('month');
        break;
      case 'secondQuarter':
        startDate = dayjs(today).startOf('year').add(3, 'month');
        endDate = dayjs(today).startOf('year').add(6, 'month').endOf('month');
        break;
      case 'thirdQuarter':
        startDate = dayjs(today).startOf('year').add(6, 'month');
        endDate = dayjs(today).startOf('year').add(9, 'month').endOf('month');
        break;
      case 'fourthQuarter':
        startDate = dayjs(today).startOf('year').add(9, 'month');
        endDate = dayjs(today).endOf('year');
        break;
      default:
        startDate = null;
        endDate = null;
    }

    setExpenseSearch({ ...expenseSearch, from_date: startDate, to_date: endDate });

    expenseFetch();
  };

  return (
    <ComponentSkeleton>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <MainCard title="">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>거래처</Typography>
                  <TextField
                    id="expense_vendor_name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={expenseSearch.expense_vendor_name}
                    onChange={(e) => setExpenseSearch({ ...expenseSearch, expense_vendor_name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4.2} lg={4.5}>
                <Typography sx={{ marginBottom: '0px', fontWeight: 'bold' }}>지출일자</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                      value={expenseSearch.from_date}
                      sx={{ width: '160px' }}
                      onChange={(newValue) => {
                        setExpenseSearch({ ...expenseSearch, from_date: newValue });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      format="YYYY-MM-DD"
                    />
                  </LocalizationProvider>
                  <Typography sx={{ fontWeight: 'bold' }}>&nbsp; ~ &nbsp;</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                      value={expenseSearch.to_date}
                      sx={{ width: '160px' }}
                      onChange={(newValue) => {
                        setExpenseSearch({ ...expenseSearch, to_date: newValue });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      format="YYYY-MM-DD"
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={3}></Grid>
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
              <Grid item xs={3} sm={3} md={3}></Grid>
              <Grid item xs={1} sm={1} md={1}>
                {/* 조회기간 선택 버튼 
                   버튼 : 당월, 전월, 올해, 전년 상반기, 하반기, 1분기, 2분기, 3분기, 4분기
                   위 버튼을 클릭하면 조회기간이 변경되어 조회되도록 함
                */}
                <Box
                  sx={{
                    display: 'flex',
                    marginTop: '-23px',
                    justifyContent: 'space-between'
                  }}
                >
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
          <CustomTable ref={CustomTableRef} type="expense" data={listData} columnDefs={columnDefs} />
        </Grid>
      </Grid>
      <Modal open={modalIsOpen} sx={registerModalStyle}>
        <ExpenseDetail />
      </Modal>
    </ComponentSkeleton>
  );
};

export default Expense;
