// material-ui

// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Button, Box, TextField, FormControl, Typography, Select, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Grid } from '../../../node_modules/@mui/material/index';
import React, { useEffect, useState } from 'react'; //eslint-disable-line no-unused-vars
import { AgGridReact } from 'ag-grid-react'; //eslint-disable-line no-unused-vars
import { ValueFormatterParams } from '@ag-grid-community/core'; //eslint-disable-line no-unused-vars
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  useCommonCodeMasterListStore,
  useCommonCodeDetailListStore,
  useCommonCodeMasterFetchStore,
  useCommonCodeDetailFetchStore,
  useCommonCodeSearchStore,
  useCommonCodeTransactionStore
} from 'store/commonCodeStore';
//gridRef
import { useRef } from 'react';
import StatusCellRenderer from 'components/StatusCellRender'; //eslint-disable-line no-unused-vars

//actionCellRenderer import
// ============================|| 결제수단 관리 ||============================ //

const CommonCode = () => {
  const { commonCodeSearch, setCommonCodeSearch } = useCommonCodeSearchStore(); //eslint-disable-line no-unused-vars
  const { masterListData, setMasterListData } = useCommonCodeMasterListStore(); //eslint-disable-line no-unused-vars
  const { detailListData, setDetailListData } = useCommonCodeDetailListStore(); //eslint-disable-line no-unused-vars
  const { commonCodeMasterFetch } = useCommonCodeMasterFetchStore(); //eslint-disable-line no-unused-vars
  const { commonCodeDetailFetch } = useCommonCodeDetailFetchStore(); //eslint-disable-line no-unused-vars
  const { commonCodeTransaction } = useCommonCodeTransactionStore(); //eslint-disable-line no-unused-vars
  //gridRef
  const masterGridRef = useRef(null);
  const detailGridRef = useRef(null);
  //클릭된 master_id
  const [masterId, setMasterId] = useState('');

  //master code, detail code columndef 설정
  const masterColumnDefs = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: '60px' },
    //action column 추가(수정, 삭제 버튼 추가, 우측정렬)
    {
      headerName: '상태',
      field: 'cellStatus',
      width: '65',
      cellStyle: { textAlign: 'center' },
      cellRenderer: StatusCellRenderer
    },
    { headerName: '마스터코드ID', field: 'master_id', sortable: true, filter: true, width: '180', hide: true },
    {
      headerName: '분류 코드',
      field: 'code',
      sortable: true,
      filter: true,
      width: '180',
      //editable : cellStatus 가 add 일때만 수정가능
      editable: (params) => {
        if (params.data.cellStatus === 'add') {
          return true;
        } else {
          return false;
        }
      }
    },
    { headerName: '분류 명', field: 'name', sortable: true, filter: true, width: '180', editable: true },
    {
      headerName: '설명',
      field: 'description',
      sortable: true,
      filter: true,
      editable: true,
      //width 는 action 컬럼까지 도달하면서 , 가로스크롤이 생기지 않도록 하는방법
      width: '250'
    },
    {
      headerName: '사용여부',
      field: 'use_yn',
      sortable: true,
      width: '100',
      editable: true,
      cellStyle: { textAlign: 'center' },
      //select box 추가
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Y', 'N'] // select box 옵션 값 설정
      }
    }
  ];

  const detailColumnDefs = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: '60px' },
    //action column 추가(수정, 삭제 버튼 추가, 우측정렬)
    {
      headerName: '상태',
      field: 'cellStatus',
      width: '65',
      cellStyle: { textAlign: 'center' },
      cellRenderer: StatusCellRenderer
    },
    { headerName: '디테일코드ID', field: 'detail_id', sortable: true, filter: true, width: '250', hide: true },
    { headerName: '마스터코드ID', field: 'master_id', sortable: true, filter: true, width: '250', hide: true },
    {
      headerName: '코드',
      field: 'code',
      sortable: true,
      filter: true,
      width: '180',
      //editable : cellStatus 가 add 일때만 수정가능
      editable: (params) => {
        if (params.data.cellStatus === 'add') {
          return true;
        } else {
          return false;
        }
      }
    },
    { headerName: '코드명', field: 'name', sortable: true, filter: true, width: '180', editable: true },
    { headerName: '설명', field: 'description', sortable: true, filter: true, width: '250', editable: true },
    { headerName: '정렬순서', field: 'sort_seq', sortable: true, filter: true, width: '120', editable: true },
    {
      headerName: '사용여부',
      field: 'use_yn',
      sortable: true,
      width: '100',
      editable: true,
      cellStyle: { textAlign: 'center' },
      //select box 추가
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Y', 'N'] // select box 옵션 값 설정
      }
    },
    {
      headerName: '시작일',
      field: 'start_date',
      sortable: true,
      filter: true,
      width: '150',
      editable: true,
      cellStyle: { textAlign: 'center' },
      cellEditor: 'agDateStringCellEditor'
    },
    {
      headerName: '종료일',
      field: 'end_date',
      sortable: true,
      filter: true,
      width: '150',
      editable: true, //날짜형식으로 변경
      cellStyle: { textAlign: 'center' },
      cellEditor: 'agDateStringCellEditor'
    },
    { headerName: '속성1', field: 'attribute1', sortable: true, filter: true, width: '150', editable: true },
    { headerName: '속성2', field: 'attribute2', sortable: true, filter: true, width: '150', editable: true },
    { headerName: '속성3', field: 'attribute3', sortable: true, filter: true, width: '150', editable: true },
    { headerName: '속성4', field: 'attribute4', sortable: true, filter: true, width: '150', editable: true },
    { headerName: '속성5', field: 'attribute5', sortable: true, filter: true, width: '150', editable: true }
  ];

  const addRowMaster = () => {
    const newRow = {
      cellStatus: 'add',
      master_id: '',
      code: '',
      name: '',
      description: '',
      use_yn: 'Y'
    };
    setMasterListData([...masterListData, newRow]);
  };

  const handleSearch = () => {
    commonCodeMasterFetch(commonCodeSearch);
  };
  const saveMasterData = () => {
    let isCheck = true;
    //저장하시겠습니까? confirm 추가
    //stopEditing 추가
    masterGridRef.current.api.stopEditing();
    //stopEditing 해도 변경된 데이터가 저장되지 않는 경우가 있어서 추가
    masterGridRef.current.api.refreshCells();
    for (let i = 0; i < masterListData.length; i++) {
      if (masterListData[i].code === '') {
        alert('분류코드를 입력해주세요.');
        isCheck = false;
        return;
      }
      if (masterListData[i].name === '') {
        alert('분류명을 입력해주세요.');
        isCheck = false;
        return;
      }
      //use_yn 입력값 체크
      if (masterListData[i].use_yn !== 'Y' && masterListData[i].use_yn !== 'N') {
        alert('사용여부는 Y 또는 N으로 입력해주세요.');
        isCheck = false;
        return;
      }
    }
    //code 중복 체크
    for (let i = 0; i < masterListData.length; i++) {
      for (let j = i + 1; j < masterListData.length; j++) {
        if (masterListData[i].code === masterListData[j].code) {
          alert('중복된 코드가 있습니다.');
          isCheck = false;
          return;
        }
      }
    }

    if (!isCheck) {
      return;
    }
    let isSave = true;
    if (window.confirm('저장하시겠습니까?')) {
      for (let i = 0; i < masterListData.length; i++) {
        if (masterListData[i].cellStatus === 'add') {
          //신규
          isSave = commonCodeTransaction('master', 'add', masterListData[i]);
        } else if (masterListData[i].cellStatus === 'edit') {
          //수정
          //cellStatus 제거 후 전송
          const updateData = { ...masterListData[i] };
          delete updateData.cellStatus;

          isSave = commonCodeTransaction('master', 'update', updateData);
        } else if (masterListData[i].cellStatus === 'delete') {
          //삭제
          isSave = commonCodeTransaction('master', 'delete', masterListData[i].master_id);
        }
      }
      if (isSave) {
        alert('저장되었습니다.');
        commonCodeMasterFetch(commonCodeSearch);
      } else {
        alert('저장에 실패하였습니다.');
      }
    }
  };

  const deleteRowMaster = () => {
    //selectedMasterRow 에서 cellStatus delete 로 변경
    const selectedMasterRow = masterGridRef.current.api.getSelectedRows();
    let updatedRows = masterListData;
    for (let i = 0; i < selectedMasterRow.length; i++) {
      if (selectedMasterRow[i].cellStatus === 'add') {
        //신규행 삭제
        updatedRows = updatedRows.filter((row) => row !== selectedMasterRow[i]);
      } else {
        //기존행 삭제 masterListData 의 cellStatus 를 delete 로 변경
        masterListData[masterListData.indexOf(selectedMasterRow[i])].cellStatus = 'delete';
      }
    }
    setMasterListData(updatedRows);
    //ag-grid 체크박스 해제
    masterGridRef.current.api.deselectAll();
  };

  const addRowDetail = () => {
    if (masterId === '') {
      alert('마스터 코드를 선택해주세요.');
      return;
    }
    //현재일 - 시작일자 (YYYY-MM-DD 형식으로 변경)
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;

    const newRow = {
      cellStatus: 'add',
      detail_id: '',
      master_id: masterId,
      code: '',
      name: '',
      description: '',
      use_yn: 'Y',
      start_date: todayDate,
      //정렬자동입력
      sort_seq: detailListData.length + 1,
      end_date: '9999-12-31',
      attribute1: '',
      attribute2: '',
      attribute3: '',
      attribute4: '',
      attribute5: ''
    };
    setDetailListData([...detailListData, newRow]);
  };

  /* detail data 저장 */
  const saveDetailData = () => {
    if (masterId === '') {
      alert('마스터 코드를 선택해주세요.');
      return;
    }
    let isCheck = true;
    //저장하시겠습니까? confirm 추가
    //stopEditing 추가
    detailGridRef.current.api.stopEditing();
    for (let i = 0; i < detailListData.length; i++) {
      if (detailListData[i].cellStatus !== 'delete') {
        if (detailListData[i].code === '') {
          alert('코드를 입력해주세요.');
          isCheck = false;
          return;
        }
        if (detailListData[i].name === '') {
          alert('코드명을 입력해주세요.');
          isCheck = false;
          return;
        }
        if (detailListData[i].sort_seq === '') {
          alert('정렬순서를 입력해주세요.');
          isCheck = false;
          return;
        } else {
          //숫자만 입력가능
          if (!/^[0-9]*$/.test(detailListData[i].sort_seq)) {
            alert('정렬순서를 입력해주세요.');
            isCheck = false;
            return;
          }
        }
        if (detailListData[i].use_yn !== 'Y' && detailListData[i].use_yn !== 'N') {
          alert('사용여부는 Y 또는 N으로 입력해주세요.');
          isCheck = false;
          return;
        }
        //시작일자

        if (detailListData[i].start_date === null) {
          alert('시작일을 입력해주세요.');
          isCheck = false;
          return;
        }

        //종료일자
        if (detailListData[i].end_date === null) {
          alert('종료일을 입력해주세요.');
          isCheck = false;
          return;
        }
      }
      //code 중복 체크
      for (let i = 0; i < detailListData.length; i++) {
        for (let j = i + 1; j < detailListData.length; j++) {
          if (detailListData[i].code === detailListData[j].code) {
            alert('중복된 코드가 있습니다.');
            isCheck = false;
            return;
          }
        }
      }
    }

    if (!isCheck) {
      return;
    }
    let isSave = true;
    if (window.confirm('저장하시겠습니까?')) {
      for (let i = 0; i < detailListData.length; i++) {
        if (detailListData[i].cellStatus === 'add') {
          //신규
          isSave = commonCodeTransaction('detail', 'add', detailListData[i]);
        } else if (detailListData[i].cellStatus === 'edit') {
          //수정
          //cellStatus 제거 후 전송
          const updateData = { ...detailListData[i] };
          delete updateData.cellStatus;
          isSave = commonCodeTransaction('detail', 'update', updateData);
        } else if (detailListData[i].cellStatus === 'delete') {
          //삭제
          isSave = commonCodeTransaction('detail', 'delete', detailListData[i].detail_id);
        }
      }

      if (isSave) {
        alert('저장되었습니다.');
        commonCodeDetailFetch(masterId);
      } else {
        alert('저장에 실패하였습니다.');
      }
    }
  };

  const deleteRowDetail = () => {
    if (masterId === '') {
      alert('마스터 코드를 선택해주세요.');
      return;
    }
    //selectedDetailRow 에서 cellStatus delete 로 변경
    const selectedDetailRow = detailGridRef.current.api.getSelectedRows();
    let updatedRows = detailListData;
    for (let i = 0; i < selectedDetailRow.length; i++) {
      if (selectedDetailRow[i].cellStatus === 'add') {
        //신규행 삭제
        updatedRows = updatedRows.filter((row) => row !== selectedDetailRow[i]);
      } else {
        //기존행 삭제 detailListData 의 cellStatus 를 delete 로 변경
        detailListData[detailListData.indexOf(selectedDetailRow[i])].cellStatus = 'delete';
      }
    }
    setDetailListData(updatedRows);
    //ag-grid 체크박스 해제
    detailGridRef.current.api.deselectAll();
  };

  useEffect(() => {
    //조회조건 초기화
    setCommonCodeSearch({ code: '', name: '' });
    commonCodeMasterFetch(commonCodeSearch);
    setMasterId(masterListData[0]?.master_id);
  }, []);

  return (
    <ComponentSkeleton>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <MainCard title="">
            <Grid container spacing={10}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>공통코드</Typography>

                  <FormControl fullWidth variant="outlined" size="small">
                    <TextField
                      id="code"
                      variant="outlined"
                      sx={{ width: '100%' }}
                      size="small"
                      value={commonCodeSearch.code}
                      onChange={(e) => setCommonCodeSearch({ ...commonCodeSearch, code: e.target.value })}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ marginBottom: '5px', fontWeight: 'bold' }}>공통코드명</Typography>
                  <TextField
                    id="name"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    size="small"
                    value={commonCodeSearch.name}
                    onChange={(e) => setCommonCodeSearch({ ...commonCodeSearch, name: e.target.value })}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={1.5} lg={4} />
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}></Box>
        </Grid>
        {/* 우측정렬로 행추가, 행삭제, 저장 버튼 추가*/}
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={addRowMaster}
            >
              행추가
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={deleteRowMaster}
            >
              행삭제
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={saveMasterData}
            >
              저장
            </Button>
          </Box>
        </Grid>
        <div
          className="ag-theme-alpine"
          style={{ height: '250px', width: '100%', marginTop: '10px' }}
          //Radius 추가
        >
          <AgGridReact
            id="masterGrid"
            ref={masterGridRef} // Ref for accessing Grid's API
            rowSelection="multiple"
            columnDefs={masterColumnDefs}
            rowData={masterListData}
            //수정 시 cellStatus 변경
            onCellEditingStarted={(e) => {
              if (e.data.cellStatus !== 'add') {
                e.data.cellStatus = 'edit';
              }
            }}
            //클릭 시 detailListData 조회
            onRowClicked={(e) => {
              //e.data.master_id 가 있을 경우 detailListData 조회
              if (e.data.master_id) {
                commonCodeDetailFetch(e.data.master_id);
                setMasterId(e.data.master_id);
              }
            }}
            //수정 시 cellStatus 변경
          ></AgGridReact>
        </div>
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={addRowDetail}
            >
              행추가
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={deleteRowDetail}
            >
              행삭제
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px', fontWeight: 'bold', height: '28px', fontSize: '13px' }}
              onClick={saveDetailData}
            >
              저장
            </Button>
          </Box>
        </Grid>

        <div
          className="ag-theme-alpine"
          style={{ height: '250px', width: '100%', marginTop: '10px' }}
          //Radius 추가
        >
          <AgGridReact
            id="detailGrid"
            ref={detailGridRef} // Ref for accessing Grid's API
            columnDefs={detailColumnDefs}
            onCellEditingStarted={(e) => {
              if (e.data.cellStatus !== 'add') {
                e.data.cellStatus = 'edit';
              }
            }}
            rowData={detailListData}
            rowSelection="multiple"
            editable={true}
            suppressHorizontalScroll={false}
          ></AgGridReact>
        </div>
      </Grid>
    </ComponentSkeleton>
  );
};

export default CommonCode;
