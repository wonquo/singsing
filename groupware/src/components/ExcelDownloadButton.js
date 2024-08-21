import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

const ExcelDownloadButton = ({ data, headers }) => {
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //file 명은 현재시간
    const date = new Date();
    XLSX.writeFile(workbook, `excel_${date.getTime()}.xlsx`);
  };
  return (
    <Button
      variant="contained"
      onClick={handleDownload}
      sx={{ marginRight: '10px', fontWeight: 'bold', height: '32px', backgroundColor: '#808080', color: 'white' }}
    >
      Excel Download
    </Button>
  );
};

export default ExcelDownloadButton;
