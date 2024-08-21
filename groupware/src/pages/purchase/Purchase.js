// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, Typography } from '@mui/material';
import { Grid } from '../../../node_modules/@mui/material/index';
import React, { useEffect } from 'react';
//register.js import
import PurchaseDetail from './PurchaseDetail';
import Modal from '@mui/material/Modal';
import CustomTable from 'components/table/CustomTable';
import { usePurchaseDeleteStore, usePurchaseListStore, usePurchaseSearchStore, usePurchaseFetchStore } from 'store/purchaseStore';
import ExcelDownloadButton from 'components/ExcelDownloadButton';
import ExcelUploadButton from 'components/ExcelUploadButton';
import templateFile from 'assets/매입관리 업로드 양식.xlsx';
import axios from 'axios';
import * as FileSaver from 'file-saver';
import { useRef } from 'react';
import { useModalStore, useSelectedListStore } from 'store/cmnStore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { usePurchaseCodeStore } from 'store/purchaseStore';
import { useParams } from 'react-router-dom';
// ============================|| 결제수단 관리 ||============================ //

const Purchase = () => {
  //useParams
  const { businessId } = useParams();

  const CustomTableRef = useRef(null); // 자식 컴포넌트의 참조 생성
  const { deleteSelectedList } = usePurchaseDeleteStore();
  const { modalIsOpen, setModalIsOpen, setModalData } = useModalStore();
  const { selectedList } = useSelectedListStore();

  const { listData } = usePurchaseListStore();
  const { purchaseSearch, setPurchaseSearch } = usePurchaseSearchStore();
  const { purchaseFetch } = usePurchaseFetchStore();

  const formatValue = (value) => {
    if (value === null) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const columnDefs = [
    //hide
    { headerName: 'purchase_id', field: 'purchase_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'business_id', field: 'business_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'remark', field: 'remark', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'memo', field: 'memo', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'proof', field: 'proof', sortable: true, filter: true, width: '200', hide: true },
    { headerName: 'useage', field: 'useage', sortable: true, filter: true, width: '200', hide: true },
    //show
    { headerName: '작성일자', field: 'issue_date', sortable: true, filter: true, width: '150' },
    { headerName: '거래처', field: 'vendor_name', sortable: true, filter: true, width: '200' },
    { headerName: '증빙', field: 'proof_name', sortable: true, filter: true, width: '150' },
    {
      headerName: '합계금액',
      field: 'total_amount',
      sortable: true,
      filter: true,
      width: '200',
      type: 'numericColumn',
      sum: true,
      valueFormatter: (params) => formatValue(params.value)
    },
    { headerName: '용도', field: 'useage_name', sortable: true, filter: true, width: '150' },
    { headerName: '내용', field: 'contents', sortable: true, filter: true, width: '380' },
    { headerName: '프로젝트/현장', field: 'project', sortable: true, filter: true, width: '200' },
    { headerName: '비고', field: 'remarks', sortable: true, filter: true, width: '200' }
  ];

  //ExcelData
  const headerDefs = ['No', '사업자', '지출일자', '거래처', '증빙', '용도', '프로젝트/현장', '합계금액', '내용', '비고'];
  const excelData = listData.map((data) => {
    return {
      No: listData.indexOf(data) + 1,
      사업자: data.business_name,
      지출일자: data.issue_date,
      거래처: data.vendor_name,
      증빙: data.proof_name,
      용도: data.useage_name,
      '프로젝트/현장': data.project,
      합계금액: formatValue(data.total_amount),
      내용: data.contents,
      비고: data.remarks
    };
  });

  const downloadExcelTemplate = () => {
    axios({
      url: templateFile,
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      FileSaver.saveAs(response.data, '매입관리 업로드 양식.xlsx');
    });
  };

  //handleSearch 함수 추가
  const handleSearch = () => {
    purchaseFetch();
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

    setPurchaseSearch({ ...purchaseSearch, from_date: startDate, to_date: endDate });

    //purchaseFetch
    purchaseFetch();
  };

  useEffect(() => {
    //조회조건 초기화
    setPurchaseSearch({
      business_id: businessId,
      vendor_name: '',
      from_date: dayjs().subtract(3, 'month'), //from_date 는 3개월 전
      to_date: dayjs()
    });

    usePurchaseCodeStore.getState().fetchPurchaseProofList(); //증빙 조회
    usePurchaseCodeStore.getState().fetchPurchaseUseageList(); //용도 조회

    //매입관리 조회
    purchaseFetch();
  }, [businessId]); // 빈 배열을 전달하여 페이지가 처음 로드될 때만 호출되도록 설정

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
                    id="vendor_name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={purchaseSearch.vendor_name}
                    onChange={(e) => setPurchaseSearch({ ...purchaseSearch, vendor_name: e.target.value })}
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
                      value={purchaseSearch.from_date}
                      sx={{ width: '160px' }}
                      onChange={(newValue) => {
                        setPurchaseSearch({ ...purchaseSearch, from_date: newValue });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      format="YYYY-MM-DD"
                    />
                  </LocalizationProvider>
                  <Typography sx={{ fontWeight: 'bold' }}>&nbsp; ~ &nbsp;</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                      value={purchaseSearch.to_date}
                      sx={{ width: '160px' }}
                      onChange={(newValue) => {
                        setPurchaseSearch({ ...purchaseSearch, to_date: newValue });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      format="YYYY-MM-DD"
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={8} sm={6} md={3} lg={3}></Grid>
              <Grid item xs={4} sm={12} md={1} lg={1}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
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
              <ExcelUploadButton onUpload={(data) => console.log(data)} key1="purchase" key2={businessId} />
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
          <CustomTable ref={CustomTableRef} type="purchase" data={listData} columnDefs={columnDefs} />
        </Grid>
      </Grid>
      <Modal open={modalIsOpen} sx={registerModalStyle}>
        <PurchaseDetail />
      </Modal>
    </ComponentSkeleton>
  );
};

export default Purchase;
