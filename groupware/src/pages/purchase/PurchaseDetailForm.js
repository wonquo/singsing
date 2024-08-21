import React, { useState, useEffect } from 'react';
import purchaseService from 'services/purchaseService';
import { Formik } from 'formik';
import { Button, Grid, Typography, OutlinedInput, Stack, FormHelperText, MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { usePurchaseFetchStore, usePurchaseCodeStore } from 'store/purchaseStore';
import { useModalStore } from 'store/cmnStore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

const PurchaseDetailForm = () => {
  const { businessId } = useParams();

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
    if (modalData.purchase_id) {
      setIsCreate(false);
    }
  }, [modalData]);

  return (
    <>
      <Formik
        initialValues={{
          business_id: parseInt(businessId),
          purchase_id: modalData.purchase_id || '',
          vendor_name: modalData.vendor_name || '',
          issue_date: modalData.issue_date ? dayjs(modalData.issue_date) : dayjs(),
          proof: modalData.proof || 'default',
          total_amount: modalData.total_amount || '',
          contents: modalData.contents || '',
          useage: modalData.useage || 'default',
          project: modalData.project || '',
          remarks: modalData.remarks || '',
          memo: modalData.memo || ''
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          // 필수 입력 필드
          //코드 : name 형태로 필드명을 입력하세요.
          const requiredFields = {
            vendor_name: '거래처',
            issue_date: '지출일자',
            proof: '증빙',
            useage: '용도',
            total_amount: '합계금액'
          };

          const emptyFields = Object.keys(requiredFields).filter(
            (field) =>
              !values[field] ||
              (Array.isArray(values[field]) && values[field].length === 0) ||
              ((field === 'useage' || field === 'proof') && values[field] === 'default')
          );

          if (emptyFields.length > 0) {
            alert(requiredFields[emptyFields[0]] + '을(를) 입력하세요.');
            setSubmitting(false); // Prevent form submission
            return;
          }

          try {
            let returnData = false; // Change const to let
            // 사업자 정보 추가
            if (!isCreate) {
              returnData = await purchaseService.updatePurchase(values);
            } else {
              returnData = await purchaseService.addPurchase(values);
            }
            if (returnData) {
              usePurchaseFetchStore.getState().purchaseFetch();
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
                    작성일자
                  </Typography>
                  {/* mui 캘린더 input */}
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                      sx={{ flex: '70%' }}
                      id="issue_date"
                      name="issue_date"
                      value={values.issue_date}
                      onChange={(date) => {
                        handleChange({ target: { name: 'issue_date', value: date } });
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
                  <OutlinedInput
                    id="vendor_name"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="vendor_name"
                    value={values.vendor_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.vendor_name && errors.vendor_name)}
                  />
                  <FormHelperText error id="vendor_name-error">
                    {touched.vendor_name && errors.vendor_name}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    증빙
                  </Typography>
                  <Select
                    sx={{ flex: '70%' }}
                    id="proof"
                    name="proof"
                    value={values.proof}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="default">선택</MenuItem>
                    {usePurchaseCodeStore.getState().purchaseProofList.map((data) => (
                      <MenuItem key={data.code} value={data.code}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error id="proof-error">
                    {touched.proof && errors.proof}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    용도
                  </Typography>
                  <Select
                    sx={{ flex: '70%' }}
                    id="useage"
                    name="useage"
                    value={values.useage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="default">선택</MenuItem>
                    {usePurchaseCodeStore.getState().purchaseUseageList.map((data) => (
                      <MenuItem key={data.code} value={data.code}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <FormHelperText error id="useage-error">
                    {touched.useage && errors.useage}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    프로젝트/현장
                  </Typography>
                  <OutlinedInput
                    id="project"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="project"
                    value={values.project}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.project && errors.project)}
                  />
                  <FormHelperText error id="project-error">
                    {touched.project && errors.project}
                  </FormHelperText>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    합계금액
                  </Typography>
                  <OutlinedInput
                    id="total_amount"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="total_amount"
                    value={numeral(values.total_amount).format('0,0')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.total_amount && errors.total_amount)}
                  />
                  <FormHelperText error id="total_amount-error">
                    {touched.total_amount && errors.total_amount}
                  </FormHelperText>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography2}>
                    내용
                  </Typography>
                  <OutlinedInput
                    id="contents"
                    type="text"
                    name="contents"
                    value={values.contents}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.contents && errors.contents)}
                  />
                  <FormHelperText error id="contents-error">
                    {touched.contents && errors.contents}
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
              {/*

              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography2}>
                    메모
                  </Typography>
                  <OutlinedInput
                    id="memo"
                    type="text"
                    name="memo"
                    value={values.memo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    multiline
                    rows={4}
                    error={Boolean(touched.memo && errors.memo)}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Stack>
              </Grid>
                      */}

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
                        await purchaseService.deletePurchase(values.purchase_id);
                        usePurchaseFetchStore.getState().purchaseFetch();
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

export default PurchaseDetailForm;
