import React, { useState, useEffect } from 'react';
import todoService from 'services/todoService';
import { Formik } from 'formik';
import { Button, Grid, Typography, Box, OutlinedInput, Stack, FormHelperText } from '@mui/material'; //eslint-disable-line no-unused-vars
import AnimateButton from 'components/@extended/AnimateButton';
import { useTodoFetchStore, useTodoDetailFetchStore } from 'store/todoStore'; //eslint-disable-line no-unused-vars
import { useTodoDetailListStore } from 'store/todoStore'; //eslint-disable-line no-unused-vars
import { useModalStore } from 'store/cmnStore';
import { AgGridReact } from 'ag-grid-react'; //eslint-disable-line no-unused-vars
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import { IconButton } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
//LineProgress 추가
import { LinearProgress } from '@mui/material';
//import { check } from 'prettier';
//detailListData 추가


const TodoDetailForm = () => {
  //const userId, name 에 session storage 값 추가
  const name = sessionStorage.getItem('name');

  const gridRef = React.useRef(null);

  const { setModalIsOpen, modalData } = useModalStore();
  const [isCreate, setIsCreate] = useState(true);
  
  const { detailListData, setDetailListData } = useTodoDetailListStore(); //eslint-disable-line no-unused-vars

  const style = {
    typography: {
      flex: '32%',
      display: 'flex',
      alignItems: 'center',
      borderRight: '2px solid #e0e0e0',
      padding: '0.5rem'
    },
    typography2: {
      flex: '17.45%',
      display: 'flex',
      alignItems: 'center',
      borderRight: '2px solid #e0e0e0',
      padding: '0.5rem'
    }
  };

  useEffect(() => {
    if (modalData.todo_master_id) {
      setIsCreate(false);
    }
    useTodoDetailFetchStore.getState().todoDetailFetch(modalData.todo_master_id);
    setLoading(false);

  }, [modalData]);



  const addRow = () => {
    const newRow = {
      cellStatus: 'add',
      todo_master_id: '',
      contents: '',
      check_yn: false,
      remark: ''
    };
    setDetailListData([...detailListData, newRow]);
  };

  const copyRow = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const copiedRows = selectedRows.map((row) => {
      return {
        cellStatus: 'add',
        todo_master_id: '',
        contents: row.contents,
        check_yn: row.check_yn,
        remark: row.remark
      };
    });
    setDetailListData([...detailListData, ...copiedRows]);
  };

  const deleteRow = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const filteredRows = detailListData.filter((row) => !selectedRows.includes(row));
    setDetailListData(filteredRows);
  }

  const [loading, setLoading] = useState(true);


  const gridColumnDefs = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: '60px' },

    { headerName: '마스터코드ID', field: 'todo_master_id', sortable: true, filter: true, width: '180', hide: true },
    //No
    {
      headerName: '내용',
      field: 'contents',
      sortable: true,
      filter: true,
      width: '600',
      editable: true,
    },
    {
      headerName: 'Check',
      field: 'check_yn',
      sortable: true,
      width: '75',
      editable: true,    
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      //checkbox 컬럼 추가
      cellRenderer: 'agCheckboxCellRenderer',
    // 체크박스 상태 초기화
    valueGetter: (params) => {
      return params.data.check_yn === 't' || params.data.check_yn === 't';
    },

    // 체크박스 상태 변경 시 값 설정
    valueSetter: (params) => {
      params.data.check_yn = params.newValue ? 't' : 'f';
      return true;
    },

    },    
    {
      headerName: '비고',
      field: 'remark',
      sortable: true,
      filter: true,
      editable: true,
      //width 는 action 컬럼까지 도달하면서 , 가로스크롤이 생기지 않도록 하는방법
      width: '180'
    },
    

    
  ];


  return (
    <>
      {loading && <LinearProgress />}
      <Grid container spacing={0}> {/* spacing을 0으로 설정 */}
        <Grid item xs={11}> {/* xs를 11로 설정하여 가로폭을 최대한 사용 */}
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            {/*<Typography variant="h3">To-Do 상세</Typography>*/}
            {isCreate ? (
              <Typography variant="h3">To-Do 추가</Typography>
            ) : (
              <Typography variant="h3">To-Do 수정</Typography>
            )}

          </Stack>
        </Grid>
        <Grid item xs={1} sx={{ textAlign: 'right', paddingLeft: 0 }}> {/* paddingLeft: 0으로 설정하여 여백 제거 */}
          <IconButton size="large" onClick={() => setModalIsOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </Grid>
      </Grid>
      <Formik
        initialValues={{
          todo_master_id: modalData.todo_master_id,
          subject: modalData.subject,
          writer: modalData.writer || name,
          write_date: modalData.write_date ? dayjs(modalData.write_date) : dayjs(),
         
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

          // 필수 입력 필드
          const requiredFields = ['subject', 'writer', 'write_date'];
          //코드 : name 형태로 필드명을 입력하세요.
          const fieldNames = {
            subject: '제목',
            writer: '작성자',
            write_date: '작성일자',
          };

          const emptyFields = requiredFields.filter(
            (field) => !values[field] || (Array.isArray(values[field]) && values[field].length === 0)
          );
          if (emptyFields.length > 0) {
            alert(fieldNames[emptyFields[0]] + '을(를) 입력하세요.');
            setSubmitting(false); // Prevent form submission
            return;
          }

          //detailListData에 content가 없는 경우 alert 추가
          if (detailListData.length > 0) {
            for (let i = 0; i < detailListData.length; i++) {
              const detailData = detailListData[i];
              if (!detailData.contents) {
                alert('내용을 입력하세요.');
                //focus 이동
                gridRef.current.api.setFocusedCell(i, 'contents');
                setSubmitting(false);
                return;
              }
            }
          }

          try {

            //gridRef.current.api.stopEditing(); 추가
            gridRef.current.api.stopEditing(); 
            //form submit 시 cell focus 제거
            gridRef.current.api.deselectAll();
            let returnData = false; // Change const to let

            //Master 저장/수정
            if (!isCreate) {
              returnData = await todoService.updateTodoMaster(values);
            } else {
              returnData = await todoService.insertTodoMaster(values);
            }

            // 일괄 삭제 후 추가
            await todoService.deleteTodoDetail(values.todo_master_id);

            //detailListData 추가 (todoService.insertTodoDetail) 에 for문 추가
            if (detailListData.length > 0) {
              for (let i = 0; i < detailListData.length; i++) {
                const detailData = detailListData[i];
                console.log(detailData);
                if(!isCreate){
                  detailData.todo_master_id = values.todo_master_id;
                } else {
                  detailData.todo_master_id = returnData.data.todo_master_id;
                }

                await todoService.insertTodoDetail(detailData);

              }
            }
            alert('저장되었습니다.');

            useTodoFetchStore.getState().todoFetch();
            setModalIsOpen(false);
          } catch (error) {
            const message = error.message || '저장에 실패했습니다.';
            setStatus({ success: false });
            setErrors({ submit: message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={1}>
              {/* 작성일자 */}
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    작성일자
                  </Typography>
                  {/* mui 캘린더 input */}
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                      sx={{ flex: '70%' }}
                      id="write_date"
                      name="write_date"
                      value={values.write_date}
                      onChange={(date) => {
                        handleChange({ target: { name: 'write_date', value: date } });
                      }}
                      renderInput={(params) => <OutlinedInput {...params} />}
                    />
                  </LocalizationProvider>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    작성자&nbsp;&nbsp;
                  </Typography>
                  <OutlinedInput
                    id="writer"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="writer"
                    value={values.writer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.writer && errors.writer)}
                  />
                  <FormHelperText error id="writer-error">
                    {touched.writer && errors.writer}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography2}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    제목
                  </Typography>
                  <OutlinedInput
                    id="subject"
                    type="text"
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.subject && errors.subject)}
                  />
                  <FormHelperText error id="subject-error">
                    {touched.subject && errors.subject}
                  </FormHelperText>
                </Stack>
              </Grid>
              
              <Grid item xs={6}></Grid>


        {/* 우측정렬로 행추가, 행삭제, 저장 버튼 추가*/}
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={copyRow}
            >
              복사
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={addRow}
            >
              추가
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={deleteRow}
            >
              삭제
            </Button>
          </Box>
        </Grid>
        <div
          className="ag-theme-alpine"
          style={{ height: '450px', width: '100%', marginTop: '10px' }}
          //Radius 추가
        >
          <AgGridReact
            id="masterGrid"
            ref={gridRef} // Ref for accessing Grid's API
            rowSelection="multiple"
            columnDefs={gridColumnDefs}
            rowData={detailListData}
            //수정 시 cellStatus 변경
            onCellEditingStarted={(e) => {
              if (e.data.cellStatus !== 'add') {
                e.data.cellStatus = 'edit';
              }
            }}

            gridOptions={{
              rowHeight: 28,
            }}

            onCellDoubleClicked={(params) => {
              if (params.colDef.field === 'check_yn') {
                // 체크박스 컬럼에서 더블클릭 시 아무 동작도 하지 않도록 방지
                params.api.stopEditing(); // 더블클릭 시 편집 모드로 들어가는 것을 방지
                return;
              }
            }
          }


            
          ></AgGridReact>
        </div>
              {!isCreate ? <Grid item xs={6}></Grid> : <Grid item xs={9}></Grid>}

              <Grid item xs={1.5}>
                <AnimateButton>
                  <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
                    {isCreate ? '저장' : '수정'}
                  </Button>
                </AnimateButton>
              </Grid>
              {/* isCreate가 false일 때만 삭제 버튼 활성화 */}
              {!isCreate && (
                <Grid item xs={1.5}>
                  <AnimateButton>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={async () => {
                        //삭제하시겠습니까? 확인 메시지 추가
                        if (!window.confirm('삭제하시겠습니까?')) {
                          return false;
                        }
                        await todoService.deleteTodoMaster(values.todo_master_id);
                        useTodoFetchStore.getState().todoFetch();
                        setModalIsOpen(false);
                      }}
                    >
                      삭제
                    </Button>
                  </AnimateButton>
                </Grid>
              )}
              {/* isCreate가 true일 때만 복사 버튼 활성화 */}
              {!isCreate && (
                <Grid item xs={1.5}>
                  <AnimateButton>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={async () => {
                        //복사하시겠습니까? 확인 메시지 추가
                        if (!window.confirm('복사하시겠습니까?')) {
                          return false;
                        }
                        
                        //3초간 setLoading(true); 후 setLoading(false); 추가
                        setLoading(true);
                        setTimeout(() => {
                          setLoading(false);
                        }, 1000);

                        //isCreate 를 false로 변경 , todo_master_id를 초기화
                        setIsCreate(true);
                        values.todo_master_id = '';
                        values.writer = name;
                        values.write_date = dayjs();

                        //detailListData check_yn 초기화
                        for (let i = 0; i < detailListData.length; i++) {
                          detailListData[i].check_yn = false;
                        }
                      }}
                    >
                      복사
                    </Button>
                  </AnimateButton>
                </Grid>
              )}
              <Grid item xs={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setModalIsOpen(false);
                  }}
                >
                  닫기
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

    </>
  );
};

export default TodoDetailForm;
