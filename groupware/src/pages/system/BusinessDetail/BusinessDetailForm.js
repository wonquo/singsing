import React, { useState, useEffect } from 'react';
import businessService from 'services/businessService';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, Grid, InputLabel, OutlinedInput, Stack, FormHelperText } from '@mui/material'; //eslint-disable-line no-unused-vars
import AnimateButton from 'components/@extended/AnimateButton';
import { useBusinessFetchStore } from 'store/businessStore'; //eslint-disable-line no-unused-vars
import { useModalStore } from 'store/cmnStore';

const BusinessDetailForm = () => {
  const { setModalIsOpen, modalData } = useModalStore(); //eslint-disable-line no-unused-vars

  // 수정/추가 구분 변수 추가
  const [isCreate, setIsCreate] = useState(true);

  useEffect(() => {
    if (modalData.business_code) {
      setIsCreate(false);
    }
  }, [modalData]);

  const validationSchema = Yup.object().shape({
    business_code: Yup.string().max(255).required('코드를 입력하세요.'),
    business_name: Yup.string().max(255).required('사업자명을 입력하세요.'),
    business_number: Yup.string().max(255).required('사업자번호를 입력하세요.')
  });

  return (
    <>
      <Formik
        initialValues={{
          business_id: modalData.business_id || '',
          business_code: modalData.business_code || '',
          business_name: modalData.business_name || '',
          business_number: modalData.business_number || ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // 사업자 정보 추가
            if (!isCreate) {
              await businessService.updateBusiness(values);
            } else {
              await businessService.addBusiness(values);
            }
            useBusinessFetchStore.getState().businessFetch();
            setModalIsOpen(false);
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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="business_code">코드</InputLabel>
                  <OutlinedInput
                    id="business_code"
                    type="text"
                    name="business_code"
                    value={values.business_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="코드를 입력하세요."
                    fullWidth
                    error={Boolean(touched.business_code && errors.business_code)}
                  />
                  <FormHelperText error id="business_code-error">
                    {touched.business_code && errors.business_code}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="business_name">사업자명</InputLabel>
                  <OutlinedInput
                    id="business_name"
                    type="text"
                    name="business_name"
                    value={values.business_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="사업자명을 입력하세요."
                    fullWidth
                    error={Boolean(touched.business_name && errors.business_name)}
                  />
                  <FormHelperText error id="business_name-error">
                    {touched.business_name && errors.business_name}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="business_number">사업자번호</InputLabel>
                  <OutlinedInput
                    id="business_number"
                    type="text"
                    name="business_number"
                    value={values.business_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="사업자번호를 입력하세요."
                    fullWidth
                    error={Boolean(touched.business_number && errors.business_number)}
                  />
                  <FormHelperText error id="business_number-error">
                    {touched.business_number && errors.business_number}
                  </FormHelperText>
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
              {!isCreate && (
                <Grid item xs={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      let returnData = await businessService.deleteBusiness(values.business_id);
                      if (returnData) {
                        useBusinessFetchStore.getState().businessFetch();
                        setModalIsOpen(false);
                      }
                    }}
                  >
                    삭제
                  </Button>
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

export default BusinessDetailForm;
