import React, { useState, useEffect } from 'react';
import salesService from 'services/salesService';
import { Formik } from 'formik';
import { Button, Grid, InputLabel, Typography, OutlinedInput, Stack, FormHelperText, MenuItem, Box } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Select } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useSalesFetchStore } from 'store/salesStore'; //eslint-disable-line no-unused-vars
import { useBusinessListStore } from 'store/businessStore'; //eslint-disable-line no-unused-vars
import { useVendorListStore } from 'store/vendorStore';
import { useProductListStore } from 'store/productStore';
import { useModalStore } from 'store/cmnStore';
import MonthCal from 'components/MonthCal';
import numeral from 'numeral';
const SalesDetailForm = () => {
  const { setModalIsOpen, modalData } = useModalStore(); //eslint-disable-line no-unused-vars
  const [isCreate, setIsCreate] = useState(true);

  const style = {
    typography: {
      flex: '30%',
      display: 'flex',
      alignItems: 'center',
      borderRight: '2px solid #e0e0e0',
      padding: '0.5rem'
    },
    typography2: {
      flex: '16%',
      display: 'flex',
      alignItems: 'center',
      borderRight: '2px solid #e0e0e0',
      padding: '0.5rem'
    },

    typography3: {
      flex: '10%',
      display: 'flex',
      alignItems: 'center',
      borderRight: '2px solid #e0e0e0',
      padding: '0.5rem'
    }
  };

  useEffect(() => {
    if (modalData.sales_id) {
      setIsCreate(false);
    }
  }, [useVendorListStore.getState.listData]);

  return (
    <>
      <Formik
        initialValues={{
          business_id: modalData.business_id || 'default',
          sales_id: modalData.sales_id,
          sales_date: modalData.sales_date,
          vendor_id: modalData.vendor_id || 'default',
          tax: modalData.tax || 'default',
          unit_price: modalData.unit_price,
          qty: modalData.qty,
          total_sales: modalData.total_sales,
          product_id: modalData.product_id || 'default',
          payment_name: modalData.payment_name || 'default',
          remarks: modalData.remarks
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const requiredFields = ['business_id', 'sales_date', 'vendor_id', 'product_id', 'tax', 'payment_name', 'total_sales'];
          //코드 : name 형태로 필드명을 입력하세요.
          const fieldNames = {
            business_id: '사업자',
            sales_date: '기준월',
            vendor_id: '거래처',
            product_id: '제품명',
            tax: '과세여부',
            payment_name: '결제수단',
            total_sales: '매출액'
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

          //values.sales_date 가 YYYY-MM 형식인지 확인
          const dateReg = /^\d{4}-\d{2}$/;
          if (!dateReg.test(values.sales_date)) {
            alert('기준월은 YYYY-MM 형식으로 입력하세요.');
            setSubmitting(false); // Prevent form submission
            return;
          }
          //values.sales_date 가 올바른 날짜인지 확인
          const date = new Date(values.sales_date + '-01');
          if (date == 'Invalid Date') {
            alert('기준월은 올바른 날짜로 입력하세요.');
            setSubmitting(false); // Prevent form submission
            return;
          }

          //values.unit_price, qty, total_sales 가 숫자인지 확인

          try {
            let returnData = false; // Change const to let
            // 사업자 정보 추가
            if (!isCreate) {
              //values 에 null 값도 넘겨줘야 함

              values.unit_price = values.unit_price || null;
              values.qty = values.qty || null;

              returnData = await salesService.updateSales(values);
            } else {
              returnData = await salesService.addSales(values);
            }
            if (returnData) {
              useSalesFetchStore.getState().salesFetch();
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
                    onBlur={handleBlur}
                    onChange={async (e) => {
                      handleChange(e);

                      handleChange({ target: { name: 'vendor_id', value: 'default' } });
                      handleChange({ target: { name: 'product_id', value: 'default' } });
                    }}
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
                    기준월
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }} style={{ flex: '69%', marginTop: '0.2rem' }}>
                    <MonthCal
                      value={values.sales_date}
                      onChange={(value) => {
                        handleChange({ target: { name: 'sales_date', value } });
                      }}
                    />
                  </Box>
                  <FormHelperText error id="sales_date-error">
                    {touched.sales_date && errors.sales_date}
                  </FormHelperText>
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
                    제품명
                  </Typography>
                  <Select
                    sx={{ flex: '70%' }}
                    id="product_id"
                    name="product_id"
                    value={values.product_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="default">선택</MenuItem>
                    {useProductListStore
                      .getState()
                      .listData.filter((data) => data.business_id === values.business_id)
                      .map((data) => (
                        <MenuItem key={data.product_id} value={data.product_id}>
                          {data.product_name}
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
                  <Select id="tax" name="tax" value={values.tax} onChange={handleChange} onBlur={handleBlur} sx={{ flex: '70%' }}>
                    <MenuItem value="default">선택</MenuItem>
                    <MenuItem value="과세">과세</MenuItem>
                    <MenuItem value="면세">면세</MenuItem>
                  </Select>
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

              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    단가
                  </Typography>
                  <OutlinedInput
                    id="unit_price"
                    type="text"
                    name="unit_price"
                    sx={{ flex: '70%' }}
                    value={numeral(values.unit_price).format('0,0')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.unit_price && errors.unit_price)}
                  />
                  <FormHelperText error id="unit_price-error">
                    {touched.unit_price && errors.unit_price}
                  </FormHelperText>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    수량
                  </Typography>
                  <OutlinedInput
                    id="qty"
                    type="text"
                    name="qty"
                    sx={{ flex: '70%' }}
                    value={numeral(values.qty).format('0,0')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.qty && errors.qty)}
                  />
                  <FormHelperText error id="qty-error">
                    {touched.qty && errors.qty}
                  </FormHelperText>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    <span style={{ color: 'red', marginRight: '2px' }}>*</span>
                    매출액
                  </Typography>
                  <OutlinedInput
                    id="total_sales"
                    type="text"
                    name="total_sales"
                    sx={{ flex: '70%' }}
                    value={numeral(values.total_sales).format('0,0')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.total_sales && errors.total_sales)}
                  />
                  <FormHelperText error id="total_sales-error">
                    {touched.total_sales && errors.total_sales}
                  </FormHelperText>
                </Stack>
              </Grid>
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
                        await salesService.deleteSales(values.sales_id);
                        useSalesFetchStore.getState().salesFetch();
                        setModalIsOpen(false);
                      }}
                    >
                      삭제
                    </Button>
                  </AnimateButton>
                </Grid>
              )}
              <Grid item xs={2}>
                <Button fullWidth variant="outlined" color="primary" onClick={() => setModalIsOpen(false)}>
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

export default SalesDetailForm;
