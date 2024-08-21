// material-ui
import { Grid, Stack, Typography, IconButton } from '@mui/material';

// project import
import Register from './Register';
import AuthWrapper from '../Wrapper';
import { useModalStore } from 'store/cmnStore';
import { CloseOutlined } from '@ant-design/icons';

// ================================|| REGISTER ||================================ //

const UserRegister = () => {
  const { setModalIsOpen } = useModalStore();
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">사용자 추가</Typography>
            <IconButton size="Large" onClick={() => setModalIsOpen(false)}>
              <CloseOutlined />
            </IconButton>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Register />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default UserRegister;
