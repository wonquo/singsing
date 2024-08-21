import React, { useState, useEffect } from 'react';
import vendorService from 'services/vendorService';
import { Formik } from 'formik';
import { Button, Grid, InputLabel, Typography, OutlinedInput, Stack, FormHelperText, MenuItem } from '@mui/material'; //eslint-disable-line no-unused-vars
import { Select } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useVendorFetchStore } from 'store/vendorStore'; //eslint-disable-line no-unused-vars
import { useBusinessFetchStore, useBusinessListStore } from 'store/businessStore'; //eslint-disable-line no-unused-vars
import { useModalStore } from 'store/cmnStore';

const VendorDetailForm = () => {
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
    if (modalData.vendor_id) {
      setIsCreate(false);
    }
    useBusinessFetchStore.getState().businessFetch('B');
  }, [modalData]);

  return (
    <>
      <Formik
        initialValues={{
          business_id: modalData.business_id || 'default',
          vendor_id: modalData.vendor_id,
          vendor_name: modalData.vendor_name,
          business_number: modalData.business_number,
          ceo: modalData.ceo,
          phone_number: modalData.phone_number,
          fax_number: modalData.fax_number,
          contact_person: modalData.contact_person,
          contact_number: modalData.contact_number,
          business_type: modalData.business_type,
          business_items: modalData.business_items,
          address: modalData.address,
          remarks: modalData.remarks
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const requiredFields = ['business_id', 'vendor_name'];
          //코드 : name 형태로 필드명을 입력하세요.
          const fieldNames = {
            business_id: '사업자',
            vendor_name: '거래처명'
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
              returnData = await vendorService.updateVendor(values);
            } else {
              returnData = await vendorService.addVendor(values);
            }

            if (returnData) {
              useVendorFetchStore.getState().vendorFetch();
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
                    거래처명
                  </Typography>
                  <OutlinedInput
                    id="vendor_name"
                    type="text"
                    name="vendor_name"
                    sx={{ flex: '70%' }}
                    value={values.vendor_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    대표자
                  </Typography>
                  <OutlinedInput
                    id="ceo"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="ceo"
                    value={values.ceo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.ceo && errors.ceo)}
                  />
                  <FormHelperText error id="ceo-error">
                    {touched.ceo && errors.ceo}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    사업자번호
                  </Typography>
                  <OutlinedInput
                    id="business_number"
                    type="text"
                    sx={{ flex: '70%' }}
                    name="business_number"
                    value={values.business_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.business_number && errors.business_number)}
                  />
                  <FormHelperText error id="business_number-error">
                    {touched.business_number && errors.business_number}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    전화번호
                  </Typography>
                  <OutlinedInput
                    id="phone_number"
                    type="text"
                    name="phone_number"
                    value={values.phone_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{ flex: '70%' }}
                    fullWidth
                    error={Boolean(touched.phone_number && errors.phone_number)}
                  />
                  <FormHelperText error id="phone_number-error">
                    {touched.phone_number && errors.phone_number}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    팩스번호
                  </Typography>
                  <OutlinedInput
                    id="fax_number"
                    type="text"
                    name="fax_number"
                    sx={{ flex: '70%' }}
                    value={values.fax_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.fax_number && errors.fax_number)}
                  />
                  <FormHelperText error id="fax_number-error">
                    {touched.fax_number && errors.fax_number}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    담당자
                  </Typography>
                  <OutlinedInput
                    id="contact_person"
                    type="text"
                    name="contact_person"
                    value={values.contact_person}
                    sx={{ flex: '70%' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.contact_person && errors.contact_person)}
                  />
                  <FormHelperText error id="contact_person-error">
                    {touched.contact_person && errors.contact_person}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    연락처
                  </Typography>

                  <OutlinedInput
                    id="contact_number"
                    type="text"
                    name="contact_number"
                    value={values.contact_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{ flex: '70%' }}
                    fullWidth
                    error={Boolean(touched.contact_number && errors.contact_number)}
                  />
                  <FormHelperText error id="contact_number-error">
                    {touched.contact_number && errors.contact_number}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    업태
                  </Typography>

                  <OutlinedInput
                    id="business_type"
                    type="text"
                    name="business_type"
                    style={{ flex: '70%' }}
                    value={values.business_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.business_type && errors.business_type)}
                  />
                  <FormHelperText error id="business_type-error">
                    {touched.business_type && errors.business_type}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography}>
                    종목
                  </Typography>

                  <OutlinedInput
                    id="business_items"
                    type="text"
                    name="business_items"
                    value={values.business_items}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    style={{ flex: '70%' }}
                    error={Boolean(touched.business_items && errors.business_items)}
                  />
                  <FormHelperText error id="business_items-error">
                    {touched.business_items && errors.business_items}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body1" sx={style.typography2}>
                    주소
                  </Typography>
                  <OutlinedInput
                    id="address"
                    type="text"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                  />
                  <FormHelperText error id="address-error">
                    {touched.address && errors.address}
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
                        await vendorService.deleteVendor(values.vendor_id);
                        useVendorFetchStore.getState().vendorFetch();
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

export default VendorDetailForm;
