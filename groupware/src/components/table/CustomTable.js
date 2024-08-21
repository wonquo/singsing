import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//useref import
import { forwardRef, useImperativeHandle, useRef } from 'react';
//css
import '../css/Component.css';
//useSelectedDataStore
import { useModalStore, useSelectedListStore } from 'store/cmnStore';
//useeffect
import { useEffect, useMemo, useCallback } from 'react';
//css;

const CustomTable = forwardRef(({ columnDefs, data, type }, ref) => {
  const gridRef = useRef();

  const { setModalIsOpen, setModalData } = useModalStore(); //eslint-disable-line no-unused-vars
  const { setSelectedList } = useSelectedListStore(); //eslint-disable-line no-unused-vars

  useEffect(() => {
    useModalStore.getState().setModalData([]);
  }, []);
  // 헤더에 전체 선택을 위한 체크박스 추가
  const updatedColumnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: '60px',
      pinned: 'left'
    },
    {
      headerName: 'No',
      valueGetter: (params) => {
        if (params.node.data.No === '합계') {
          return '합계';
        } else {
          return params.node.rowIndex + 1;
        }
      },
      width: '80px',
      pinned: 'left'
    },
    ...columnDefs
  ];

  const handleRowSelected = (event) => {
    //방금 선택한 row의 데이터를 가져옴
    const selectedData = event.api.getSelectedRows();
    if (selectedData.length === 0) {
      setModalData([]);
      setSelectedList([]);
    } else {
      setModalData(selectedData[0]);
      setSelectedList(selectedData);
    }
  };

  const handleRowDoubleClick = (event) => {
    //합계 row는 클릭시 모달창을 띄우지 않음

    if (event.data.No === '합계') {
      return;
    }
    setModalData(event.data);
    setModalIsOpen(true);
  };

  const deleteSelectedData = () => {
    // gridRef deSelectAll api
    gridRef.current.api.deselectAll();
  };

  const pinnedBottomRowData = useMemo(() => {
    const sumRow = {
      No: '합계' // No 열에 '합계' 문자열 추가
    };
    columnDefs.reduce((acc, columnDef) => {
      if (!columnDef.sum) {
        sumRow[columnDef.field] = '';
      } else {
        sumRow[columnDef.field] = data.reduce((acc, row) => acc + row[columnDef.field], 0);
      }
      return acc;
    }, {});

    return [sumRow];
  }, [data, columnDefs]);

  const getRowStyle = useCallback((params) => {
    if (params.node.rowPinned) {
      return { fontWeight: 'bold' };
    }
  }, []);

  useImperativeHandle(ref, () => ({
    deleteSelectedData
  }));

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: '600px', width: '100%', marginTop: '20px' }}
      //Radius 추가
    >
      <AgGridReact
        ref={gridRef}
        columnDefs={updatedColumnDefs}
        onSortChanged={(e) => {
          e.api.refreshCells();
        }}
        rowData={data}
        rowSelection="multiple"
        //No 열 추가
        onSelectionChanged={handleRowSelected}
        onRowDoubleClicked={handleRowDoubleClick}
        headerHeight={40}
        //type이 sales 일때는 pinnedBottomRowData를 사용하고 아닐때는 null
        pinnedBottomRowData={type === 'sales' || type === 'expense' || type === 'purchase' ? pinnedBottomRowData : null}
        getRowStyle={getRowStyle}
        //cell 복사 허용
        enableClipboard={true}
        enableCellTextSelection={true}
      ></AgGridReact>
    </div>
  );
});

export default CustomTable;
