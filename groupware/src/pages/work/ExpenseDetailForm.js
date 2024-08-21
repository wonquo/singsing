import React, { useState, useEffect } from 'react';
import expenseService from 'services/expenseService';
import { Formik } from 'formik';
import { Button, Grid, Typography, OutlinedInput, Stack, FormHelperText, MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useExpenseFetchStore, useExpenseVendorStore } from 'store/expenseStore';
import { useModalStore } from 'store/cmnStore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import numeral from 'numeral';
import dayjs from 'dayjs';

const ExpenseDetailForm = () => {
  const { setModalIsOpen, modalData } = useModalStore();
  const [isCreate, setIsCreate] = useState(true);

  const style = {
    typography: {
      flex: '32%',
      display: 'flex',
      alignItems: 'center',
      borderRight: '2px solid #e0e0e0',
      padding: '0.5rem'
    },
    typography2: {
      flex: '17%',
      display: 'flex',
      alignItems: 'center',
      borderRight: '2px solid #e0e0e0',
      padding: '0.5rem'
    }
  };

  useEffect(() => {
    if (modalData.expense_id) {
      setIsCreate(false);
    }
  }, [modalData]);

  return (
    <>
      <Formik
        initialValues={{
          expense_id: modalData.expense_id,
          expense_vendor_code: modalData.expense_vendor_code || 'default',
          expense_date: modalData.expense_date ? dayjs(modalData.expense_date) : dayjs(),
          expense_content: modalData.expense_content,
          expense_purpose: modalData.expense_purpose,
          manager: modalData.manager,
          expense_amount: modalData.expense_amount,
          remarks: modalData.remarks
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          // 필수 입력 필드
          const requiredFields = ['expense_vendor_code', 'expense_date', 'expense_content', 'expense_purpose', 'manager', 'expense_amount'];
          //코드 : name 형태로 필드명을 입력하세요.
          const fieldNames = {
            expense_vendor_code: '거래처',
            expense_date: '지출일자',
            expense_content: '지출내용',
            expense_purpose: '지출목적',
            manager: '담당자',
            expense_amount: '지출금액'
          };

          const emptyFields = requiredFields.filter(
            (field) => !values[field] || (field === 'expense_vendor_code' && values[field] === 'default')
          );
          if (emptyFields.length > 0) {
            alert(fieldNames[emptyFields[0]] + '을(를) 입력하세요.');
            setSubmitting(false); // Prevent form submission
            return;
          }

          try {
            let returnData = false; // Change const to let
            // 사업자 정보 추가
            if (!isCreate) {
              returnData = await expenseService.updateExpense(values);
            } else {
              returnData = await expenseService.addExpense(values);
            }
            if (returnData) {
              useExpenseFetchStore.getState().expenseFetch();
              setModalIsOpen(false);
            }
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
              {/* 지출일자 */}
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    지출일자
                  </Typography>
                  {/* mui 캘린더 input */}
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                      sx={{ flex: '70%' }}
                      id="expense_date"
                      name="expense_date"
                      value={values.expense_date}
                      onChange={(date) => {
                        handleChange({ target: { name: 'expense_date', value: date } });
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
                    거래처
                  </Typography>
                  <Select
                    sx={{ flex: '70%' }}
                    id="expense_vendor_code"
                    name="expense_vendor_code"
                    value={values.expense_vendor_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="default">선택</MenuItem>
                    {useExpenseVendorStore.getState().expenseVendorList.map((data) => (
                      <MenuItem key={data.code} value={data.code}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    지출내용
                  </Typography>
                  <OutlinedInput
                    id="expense_content"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="expense_content"
                    value={values.expense_content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.expense_content && errors.expense_content)}
                  />
                  <FormHelperText error id="expense_content-error">
                    {touched.expense_content && errors.expense_content}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    지출목적
                  </Typography>
                  <OutlinedInput
                    id="expense_purpose"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="expense_purpose"
                    value={values.expense_purpose}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.expense_purpose && errors.expense_purpose)}
                  />
                  <FormHelperText error id="expense_purpose-error">
                    {touched.expense_purpose && errors.expense_purpose}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    담당자&nbsp;&nbsp;
                  </Typography>
                  <OutlinedInput
                    id="manager"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="manager"
                    value={values.manager}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.manager && errors.manager)}
                  />
                  <FormHelperText error id="manager-error">
                    {touched.manager && errors.manager}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    금액
                  </Typography>
                  <OutlinedInput
                    id="expense_amount"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="expense_amount"
                    value={numeral(values.expense_amount).format('0,0')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.expense_amount && errors.expense_amount)}
                  />
                  <FormHelperText error id="expense_amount-error">
                    {touched.expense_amount && errors.expense_amount}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography2}>
                    비고
                  </Typography>
                  <OutlinedInput
                    id="remarks"
                    type="text"
                    name="remarks"
                    value={values.remarks}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    multiline
                    rows={4}
                    error={Boolean(touched.remarks && errors.remarks)}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Stack>
              </Grid>

              {!isCreate ? <Grid item xs={6}></Grid> : <Grid item xs={8}></Grid>}

              <Grid item xs={2}>
                <AnimateButton>
                  <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>
                    {isCreate ? '추가' : '수정'}
                  </Button>
                </AnimateButton>
              </Grid>
              {/* isCreate가 false일 때만 삭제 버튼 활성화 */}
              {!isCreate && (
                <Grid item xs={2}>
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
                        await expenseService.deleteExpense(values.expense_id);
                        useExpenseFetchStore.getState().expenseFetch();
                        setModalIsOpen(false);
                      }}
                    >
                      삭제
                    </Button>
                  </AnimateButton>
                </Grid>
              )}
              <Grid item xs={2}>
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

export default ExpenseDetailForm;
