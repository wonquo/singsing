import React, { useState, forwardRef, useImperativeHandle } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateEditor = forwardRef((props, ref) => {
  const [date, setDate] = useState(new Date());

  // 에디터 값을 부모 컴포넌트로 전달하는 함수
  useImperativeHandle(ref, () => ({
    getValue() {
      return date;
    }
  }));

  // 날짜가 변경될 때 실행되는 함수
  const handleChange = (date) => {
    setDate(date);
  };

  return <DatePicker selected={date} onChange={handleChange} dateFormat="yyyy-MM-dd" showYearDropdown scrollableYearDropdown />;
});

export default DateEditor;
