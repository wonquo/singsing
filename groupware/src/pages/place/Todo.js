// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, FormControl, Typography, Select, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
//register.js import
import TodoDetail from './TodoDetail';
import Modal from '@mui/material/Modal';
import CustomTable from 'components/table/CustomTable';
import {
  useTodoDeleteStore,
  useTodoListStore,
  useTodoSearchStore,
  useTodoFetchStore,
} from 'store/todoStore';
import ExcelDownloadButton from 'components/ExcelDownloadButton';
import { useRef } from 'react';
import { useModalStore, useSelectedListStore } from 'store/cmnStore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ============================|| 결제수단 관리 ||============================ //

const Todo = () => {
  const CustomTableRef = useRef(null); // 자식 컴포넌트의 참조 생성
  const { deleteSelectedList } = useTodoDeleteStore();
  const { modalIsOpen, setModalIsOpen, setModalData } = useModalStore();
  const { selectedList } = useSelectedListStore();

  const { listData, setListData } = useTodoListStore(); //eslint-disable-line no-unused-vars
  const { todoSearch, setTodoSearch } = useTodoSearchStore(); //eslint-disable-line no-unused-vars
  const { todoFetch } = useTodoFetchStore(); //eslint-disable-line no-unused-vars

  const columnDefs = [
    { headerName: 'Todo Master ID', field: 'todo_master_id', sortable: true, filter: true, width: '200', hide: true },
    { headerName: '제목', field: 'subject', sortable: true, filter: true, width: '800' },
    { headerName: '작성일자', field: 'write_date', sortable: true, filter: true, width: '200' },
    { headerName: '작성자', field: 'writer', sortable: true, filter: true, width: '200' },
    { headerName: '상태', field: 'status', sortable: true, filter: true, width: '200' }
  ];
  
  const headerDefs = ['No', '제목', '작성일자', '작성자', '상태'];
  
  /*
  const excelData = listData.map((data) => {
    return {
      No: listData.indexOf(data) + 1,
      제목: data.subject,
      요청일자: data.request_date,
      요청자: data.requester,
      상태: data.status
    };
  });
  */
  const excelData = [];

  //handleSearch 함수 추가
  const handleSearch = () => {
    todoFetch();
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
    setTodoSearch({
      subject: '',
      //from_date 는 3개월 전
      from_date: dayjs().subtract(3, 'month'),
      to_date: dayjs()
    });
    todoFetch();
  }, []); // 빈 배열을 전달하여 페이지가 처음 로드될 때만 호출되도록 설정


  return (
    <ComponentSkeleton>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <MainCard title="">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>제목</Typography>
                  <TextField
                    id="subject"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={todoSearch.subject}
                    onChange={(e) => setTodoSearch({ ...todoSearch, subject: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4.2} lg={4.5}>
                <Typography sx={{ marginBottom: '0px', fontWeight: 'bold' }}>작성일자</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                      value={todoSearch.from_date}
                      sx={{ width: '160px' }}
                      onChange={(newValue) => {
                        setTodoSearch({ ...todoSearch, from_date: newValue });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      format="YYYY-MM-DD"
                    />
                  </LocalizationProvider>
                  <Typography sx={{ fontWeight: 'bold' }}>&nbsp; ~ &nbsp;</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                      value={todoSearch.to_date}
                      sx={{ width: '160px' }}
                      onChange={(newValue) => {
                        setTodoSearch({ ...todoSearch, to_date: newValue });
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
          <CustomTable ref={CustomTableRef} type="todo" data={listData} columnDefs={columnDefs} />
        </Grid>
      </Grid>
      <Modal open={modalIsOpen} sx={registerModalStyle}>
        <TodoDetail />
      </Modal>
    </ComponentSkeleton>
  );
};

export default Todo;
