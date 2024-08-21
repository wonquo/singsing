import React, { useState, useEffect } from 'react';
import productService from 'services/productService';
import { Formik } from 'formik';
import { Button, Grid, InputLabel, Typography, OutlinedInput, Stack, FormHelperText, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Select } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useProductFetchStore } from 'store/productStore'; //eslint-disable-line no-unused-vars
import { useBusinessFetchStore, useBusinessListStore } from 'store/businessStore'; //eslint-disable-line no-unused-vars
import { useModalStore } from 'store/cmnStore';

const ProductDetailForm = () => {
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
    }
  };

  useEffect(() => {
    if (modalData.product_id) {
      setIsCreate(false);
    }
    useBusinessFetchStore.getState().businessFetch('B');
  }, [modalData]);

  return (
    <>
      <Formik
        initialValues={{
          business_id: modalData.business_id || 'default',
          product_id: modalData.product_id,
          product_gubun: modalData.product_gubun,
          product_name: modalData.product_name,
          product_code: modalData.product_code,
          product_number: modalData.product_number,
          specification: modalData.specification,
          unit: modalData.unit,
          selling_price: modalData.selling_price,
          product_description: modalData.product_description,
          remarks: modalData.remarks
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const requiredFields = ['business_id', 'product_name'];
          //코드 : name 형태로 필드명을 입력하세요.
          const fieldNames = {
            business_id: '사업자',
            product_name: '제품명'
          };

          const emptyFields = requiredFields.filter((field) => !values[field] || (field === 'business_id' && values[field] === 'default'));
          if (emptyFields.length > 0) {
            alert(fieldNames[emptyFields[0]] + '을(를) 입력하세요.');
            setSubmitting(false); // Prevent form submission
            return;
          }

          try {
            // 사업자 정보 추가
            let returnData = false;
            if (!isCreate) {
              returnData = await productService.updateProduct(values);
            } else {
              returnData = await productService.addProduct(values);
            }
            if (returnData) {
              useProductFetchStore.getState().productFetch();
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
                    onChange={handleChange}
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
                    제품명
                  </Typography>
                  <OutlinedInput
                    id="product_name"
                    type="text"
                    name="product_name"
                    sx={{ flex: '70%' }}
                    value={values.product_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.product_name && errors.product_name)}
                  />
                  <FormHelperText error id="product_name-error">
                    {touched.product_name && errors.product_name}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    제품구분
                  </Typography>
                  <OutlinedInput
                    id="product_gubun"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="product_gubun"
                    value={values.product_gubun}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.product_gubun && errors.product_gubun)}
                  />
                  <FormHelperText error id="product_gubun-error">
                    {touched.product_gubun && errors.product_gubun}
                  </FormHelperText>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    제품번호
                  </Typography>
                  <OutlinedInput
                    id="product_number"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="product_number"
                    value={values.product_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.product_number && errors.product_number)}
                  />
                  <FormHelperText error id="product_number-error">
                    {touched.product_number && errors.product_number}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    제품코드
                  </Typography>
                  <OutlinedInput
                    id="product_code"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="product_code"
                    value={values.product_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.product_code && errors.product_code)}
                  />
                  <FormHelperText error id="product_code-error">
                    {touched.product_code && errors.product_code}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    규격
                  </Typography>
                  <OutlinedInput
                    id="specification"
                    type="text"
                    name="specification"
                    sx={{ flex: '70%' }}
                    value={values.specification}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.specification && errors.specification)}
                  />
                  <FormHelperText error id="specification-error">
                    {touched.specification && errors.specification}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    단위
                  </Typography>
                  <OutlinedInput
                    id="unit"
                    type="text"
                    name="unit"
                    sx={{ flex: '70%' }}
                    value={values.unit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.unit && errors.unit)}
                  />
                  <FormHelperText error id="unit-error">
                    {touched.unit && errors.unit}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    판매단가
                  </Typography>
                  <OutlinedInput
                    id="selling_price"
                    type="text"
                    name="selling_price"
                    sx={{ flex: '70%' }}
                    value={values.selling_price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.selling_price && errors.selling_price)}
                  />
                  <FormHelperText error id="selling_price-error">
                    {touched.selling_price && errors.selling_price}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography2}>
                    제품설명
                  </Typography>
                  <OutlinedInput
                    id="product_description"
                    type="text"
                    name="product_description"
                    value={values.product_description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    multiline
                    rows={4}
                    error={Boolean(touched.product_description && errors.product_description)}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
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
                        await productService.deleteProduct(values.product_id);
                        useProductFetchStore.getState().productFetch();
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

export default ProductDetailForm;
