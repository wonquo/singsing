import React, { useRef } from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
import excelService from '../services/excelService';
import Loader from './Loader'; //eslint-disable-line no-unused-vars
//cmnstore useLoaderStore import
import { useLoaderStore } from 'store/cmnStore';

const ExcelUploadButton = ({ onUpload, key1, key2 }) => {
  const inputRef = useRef(null);
  const { isLoading, setIsLoading } = useLoaderStore(); //eslint-disable-line no-unused-vars

  const handleUpload = (e) => {
    setIsLoading(true); // 업로드 시작 시 Loader를 활성화합니다.
    const file = e.target.files[0];
    if (!file) {
      setIsLoading(false); // 파일이 선택되지 않았을 경우 Loader를 비활성화합니다.
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0]; // Assuming there is only one sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      onUpload(jsonData);
      excelService.uploadDataToDB(jsonData, key1, key2);
    };
    reader.readAsBinaryString(file);
  };

  const handleClick = () => {
    inputRef.current.value = null; // Reset input value to trigger onChange event even if the same file is selected again
    inputRef.current.click();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px', backgroundColor: '#808080', color: 'white' }}
      >
        Excel Upload
      </Button>
      <input ref={inputRef} id="excel-upload-button" type="file" accept=".xlsx, .xls" onChange={handleUpload} style={{ display: 'none' }} />
      {isLoading && <Loader />} {/* 업로드 중일 때 Loader를 표시합니다. */}
    </>
  );
};

export default ExcelUploadButton;
