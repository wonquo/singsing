import React, { useState, useEffect } from 'react';
import userService from 'services/userService';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  FormHelperText
} from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import { useUserListStore, useUserSearchStore } from 'store/userStore';
import { useModalStore } from 'store/cmnStore';

const Register = () => {
  const { setModalIsOpen, modalData } = useModalStore(); //eslint-disable-line no-unused-vars
  const [showPassword, setShowPassword] = useState(false);
  const { listData, setListData } = useUserListStore(); //eslint-disable-line no-unused-vars
  // 수정/추가 구분 변수 추가
  const [isCreate, setIsCreate] = useState(true);

  useEffect(() => {
    if (modalData.id) {
      setIsCreate(false);
    }
  }, [modalData]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const validationSchema = Yup.object().shape(
    isCreate
      ? {
          name: Yup.string().max(255).required('이름을 입력하세요.'),
          id: Yup.string().max(255).required('아이디를 입력하세요.'),
          auth: Yup.string().max(255).required('권한을 선택하세요.'),
          password: Yup.string().max(255).required('비밀번호를 입력하세요.'),
          confirmPassword: Yup.string().max(255).required('비밀번호를 다시 입력하세요.')
        }
      : {
          name: Yup.string().max(255).required('이름을 입력하세요.'),
          id: Yup.string().max(255).required('아이디를 입력하세요.'),
          auth: Yup.string().max(255).required('권한을 선택하세요.')
        }
  );

  return (
    <>
      <Formik
        initialValues={{
          user_id: modalData.user_id || '',
          name: modalData.name || '',
          id: modalData.id || '',
          auth: modalData.auth || 'user',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (values.password !== values.confirmPassword) {
              alert('비밀번호가 일치하지 않습니다.');
              return;
            }
            // 사용자 정보 추가
            let returnData = false; // Change const to let
            if (!isCreate) {
              returnData = await userService.updateUser(values);
            } else {
              returnData = await userService.addUser(values);
            }
            if (returnData) {
              const data = await userService.getUsers();
              setListData(data);
              setModalIsOpen(false);
            }
          } catch (error) {
            const message = error.message || '사용자 추가에 실패했습니다.';
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
                  <InputLabel htmlFor="name">이름</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="이름을 입력하세요."
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                  <FormHelperText error id="name-error">
                    {touched.name && errors.name}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="id">아이디</InputLabel>
                  <OutlinedInput
                    id="id"
                    type="text"
                    name="id"
                    value={values.id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="아이디를 입력하세요."
                    fullWidth
                    error={Boolean(touched.id && errors.id)}
                  />
                  <FormHelperText error id="id-error">
                    {touched.id && errors.id}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="auth">권한</InputLabel>
                  <Select id="auth" name="auth" value={values.auth} onChange={handleChange} onBlur={handleBlur} fullWidth>
                    <MenuItem value="admin">관리자</MenuItem>
                    <MenuItem value="user">사용자</MenuItem>
                  </Select>
                  <FormHelperText error id="auth-error">
                    {touched.auth && errors.auth}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password">패스워드</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="비밀번호를 입력하세요."
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText error id="password-error">
                    {touched.password && errors.password}
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password">패스워드 확인</InputLabel>
                  <OutlinedInput
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="비밀번호를 다시 입력하세요."
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText error id="confirmPassword-error">
                    {touched.confirmPassword && errors.confirmPassword}
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
                  <AnimateButton>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={async () => {
                        await userService.deleteUser(values.user_id);
                        const userSearch = useUserSearchStore.getState().userSearch;
                        const data = await userService.getUsers(userSearch);
                        setListData(data);
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

export default Register;
