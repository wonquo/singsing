import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
// material-ui
import { Box, ButtonBase, Stack, Typography, IconButton } from '@mui/material';
// assets
import { LogoutOutlined } from '@ant-design/icons'; //eslint-disable-line no-unused-vars
import useLoginStore from 'store/loginStore';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const { clearIsLogin } = useLoginStore();

  const handleLogout = () => {
    // 로그아웃 처리
    // sessionStorage에서 userId 삭제
    sessionStorage.removeItem('userId');
    // isLogin을 false로 변경
    clearIsLogin();
  };

  const iconBackColorOpen = 'grey.300';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" alignItems="center" sx={{ p: 0.5 }} onClick={handleLogout}>
          <IconButton size="large" color="secondary">
            <LogoutOutlined />
          </IconButton>
          <Typography variant="subtitle1">Logout</Typography>
        </Stack>
      </ButtonBase>
    </Box>
  );
};

export default Profile;
