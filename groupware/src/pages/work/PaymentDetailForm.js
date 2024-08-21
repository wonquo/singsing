import React, { useState, useEffect } from 'react';
import paymentService from 'services/paymentService';
import { Formik } from 'formik';
import { Button, Grid, InputLabel, Typography, OutlinedInput, Stack, FormHelperText, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Select } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { usePaymentFetchStore } from 'store/paymentStore'; //eslint-disable-line no-unused-vars
import { useBusinessListStore } from 'store/businessStore'; //eslint-disable-line no-unused-vars
import { useVendorListStore } from 'store/vendorStore';
import { useModalStore } from 'store/cmnStore';
const PaymentDetailForm = () => {
  const { setModalIsOpen, modalData } = useModalStore(); //eslint-disable-line no-unused-vars
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
    if (modalData.payment_id) {
      setIsCreate(false);
    }
  }, [modalData]);

  return (
    <>
      <Formik
        initialValues={{
          business_id: modalData.business_id || 'default',
          payment_id: modalData.payment_id,
          payment_name: modalData.payment_name || 'default',
          vendor_id: modalData.vendor_id || 'default',
          tax: modalData.tax || 'default',
          remarks: modalData.remarks
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const requiredFields = ['business_id', 'vendor_id', 'payment_name', 'tax'];
          //코드 : name 형태로 필드명을 입력하세요.
          const fieldNames = {
            business_id: '사업자',
            vendor_id: '거래처',
            payment_name: '결제수단',
            tax: '과세여부'
          };

          const emptyFields = requiredFields.filter(
            (field) =>
              !values[field] ||
              (field === 'business_id' && values[field] === 'default') ||
              (field === 'tax' && values[field] === 'default') ||
              (field === 'payment_name' && values[field] === 'default') ||
              (field === 'vendor_id' && values[field] === 'default')
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
              returnData = await paymentService.updatePayment(values);
            } else {
              returnData = await paymentService.addPayment(values);
            }
            if (returnData) {
              usePaymentFetchStore.getState().paymentFetch();
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
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    사업자
                  </Typography>
                  <Select
                    sx={{ bgcolor: '#fff0f0', flex: '70%' }}
                    id="business_id"
                    name="business_id"
                    value={values.business_id}
                    //사업자 변경시 거래처 목록을 조회
                    onChange={async (e) => {
                      handleChange(e);
                      handleChange({ target: { name: 'vendor_id', value: 'default' } });
                    }}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="default">선택</MenuItem>
                    {useBusinessListStore.getState().listData.map((data) => (
                      <MenuItem key={data.business_id} value={data.business_id}>
                        {data.business_name}
                      </MenuItem>
                    ))}
                  </Select>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Stack>
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    거래처
                  </Typography>
                  <Select
                    sx={{ flex: '70%' }}
                    id="vendor_id"
                    name="vendor_id"
                    value={values.vendor_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="default">선택</MenuItem>
                    {useVendorListStore
                      .getState()
                      .listData.filter((data) => data.business_id === values.business_id)
                      .map((data) => (
                        <MenuItem key={data.vendor_id} value={data.vendor_id}>
                          {data.vendor_name}
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
                    과세여부
                  </Typography>
                  <Select id="tax" name="tax" value={values.tax} onChange={handleChange} onBlur={handleBlur} fullWidth sx={{ flex: '70%' }}>
                    <MenuItem value="default">선택</MenuItem>
                    <MenuItem value="과세">과세</MenuItem>
                    <MenuItem value="면세">면세</MenuItem>
                  </Select>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <FormHelperText error id="tax-error">
                    {touched.tax && errors.tax}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    결제수단
                  </Typography>
                  <Select
                    sx={{ flex: '70%' }}
                    id="payment_name"
                    name="payment_name"
                    value={values.payment_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="default">선택</MenuItem>
                    <MenuItem value="신용카드">신용카드</MenuItem>
                    <MenuItem value="현금영수증">현금영수증</MenuItem>
                    <MenuItem value="기타">기타</MenuItem>
                  </Select>
                  <FormHelperText error id="payment_name-error">
                    {touched.payment_name && errors.payment_name}
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
                        await paymentService.deletePayment(values.payment_id);
                        usePaymentFetchStore.getState().paymentFetch();
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

export default PaymentDetailForm;
