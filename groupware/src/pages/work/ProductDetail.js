// material-ui
import { Grid, Stack, Typography, IconButton } from '@mui/material';

// project import
import ProductDetailForm from './ProductDetailForm';
import AuthWrapper from './Wrapper';
import { CloseOutlined } from '@ant-design/icons';
import { useModalStore } from 'store/cmnStore';
// ================================|| REGISTER ||================================ //

const UserRegister = () => {
  const { setModalIsOpen } = useModalStore();
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">제품 관리</Typography>
          </Stack>
        </Grid>
        <Grid item xs={1} sx={{ textAlign: 'right' }}>
          <IconButton size="Large" onClick={() => setModalIsOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <ProductDetailForm />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default UserRegister;
