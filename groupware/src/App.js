// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
//login
import useLoginStore from 'store/loginStore';
import Login from 'pages/authentication/Login'; //eslint-disable-line

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const { isLogin, userId, setLogout } = useLoginStore(); //eslint-disable-line
  return (
    <div>
      {isLogin || sessionStorage.getItem('userId') ? (
        <ThemeCustomization>
          <ScrollTop>
            <Routes />
          </ScrollTop>
        </ThemeCustomization>
      ) : (
        <ThemeCustomization>
          <ScrollTop>
            <Login />
          </ScrollTop>
        </ThemeCustomization>
      )}
    </div>
  );
};

export default App;
