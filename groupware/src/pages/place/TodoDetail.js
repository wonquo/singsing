// material-ui
import { Grid, Stack, Typography, IconButton, Box } from '@mui/material'; //eslint-disable-line no-unused-vars

// project import
import ExpenseDetailForm from './TodoDetailForm';
import AuthWrapper from './Wrapper';
// ================================|| REGISTER ||================================ //

const UserRegister = () => {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <ExpenseDetailForm />
          </Box>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default UserRegister;
