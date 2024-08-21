import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
//useSalesChartStore
import { useSalesChartStore } from 'store/dashboardStore';

const AnalyticEcommerce = ({ business_id, date, title, count, rate, businessYn, profit }) => {
  //setBusinessId
  const { monthlySalesByVendorSearchParams, fetchVendorMonthlySales, fetchMonthlySales } = useSalesChartStore();
  // 새로운 함수 추가
  const handleClick = () => {
    if (businessYn === 'Y') {
      useSalesChartStore.getState().fetchMonthlySalesByVendorInit();
      let businessId = monthlySalesByVendorSearchParams.business_id;
      if (businessId === business_id) {
        business_id = '';
      }
      monthlySalesByVendorSearchParams.business_id = business_id;
      useSalesChartStore.getState().fetchMonthlySalesByVendor();

      //차트 조회
      if (business_id === 0 || business_id === '') {
        fetchMonthlySales('');
      } else {
        fetchVendorMonthlySales(business_id, '');
      }
    }
  };

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" color="textSecondary">
          {date}
        </Typography>
        <Typography
          //font size 변경
          sx={{
            fontSize: '1rem',
            //bold 처리
            fontWeight: '600',
            cursor: businessYn === 'Y' ? 'pointer' : 'default'
          }}
          onClick={handleClick} // 새로운 함수를 onClick 이벤트에 연결
        >
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item lg={8} md={8} sm={8} xs={8}>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={4}>
            <Typography variant="h5" color={rate < 0 ? '#EF4770' : '#11B886'} textAlign="right">
              {rate > 0 ? '+ ' : ' '}
              {rate}%
            </Typography>
          </Grid>
          {profit && (
            <Grid item xs={12}>
              <Typography variant="h4" color="inherit">
                ({profit})
              </Typography>
            </Grid>
          )}
        </Grid>
      </Stack>
    </MainCard>
  );
};

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

AnalyticEcommerce.defaultProps = {
  color: 'primary'
};

export default AnalyticEcommerce;
