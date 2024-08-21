import { Box, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import YearCal from 'components/YearCal';
import PropTypes from 'prop-types';
import { fetchAnnualSales } from 'store/dashboardStore'; //eslint-disable-line no-unused-vars
import { useBusinessListStore } from 'store/businessStore';
import { MenuItem, Select } from '@mui/material';
import { useSalesChartStore } from 'store/dashboardStore';
const AnnualSales = () => {
  const { annualSearchParams, setAnnualSearchParams, fetchAnnualSales, annualSales } = useSalesChartStore();
  const handleBusinessChange = (business_id) => {
    setAnnualSearchParams({ ...annualSearchParams, business_id: business_id });
    fetchAnnualSales();
  };
  const handleYearChange = (date) => {
    if (typeof date === 'string') {
      setAnnualSearchParams({ ...annualSearchParams, yyyy: date });
      fetchAnnualSales();
    } else {
      setAnnualSearchParams({ ...annualSearchParams, yyyy: date.getFullYear().toString() });
      fetchAnnualSales();
    }
  };

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', height: '20px' }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ marginTop: '5px' }}>
              {annualSales.length > 0 ? (annualSales[0].yyyy ? annualSales[0].yyyy.slice(0, 4) : '0') : '0'}
            </Typography>
            <Box sx={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row' }}>
              <Select
                labelId="business_id"
                id="business_id"
                value={annualSearchParams.business_id}
                onChange={(e) => handleBusinessChange(e.target.value)}
                sx={{ width: '120px', height: '30px', marginRight: '10px' }}
              >
                <MenuItem value="all">전체</MenuItem>
                {useBusinessListStore.getState().listData.map((data) => (
                  <MenuItem key={data.business_id} value={data.business_id}>
                    {data.business_name}
                  </MenuItem>
                ))}
              </Select>
              <YearCal value={annualSearchParams.yyyy} onChange={(date) => handleYearChange(date)} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h5">
            {annualSearchParams.business_id === 'all'
              ? '전체 연간 매출액'
              : useBusinessListStore.getState().listData.find((data) => data.business_id === annualSearchParams.business_id).business_name +
                ' 연간 매출액'}
          </Typography>
        </Grid>
        <Grid container>
          <Grid item lg={10} md={10} sm={10} xs={10}>
            <Typography variant="h4" color="inherit">
              {annualSales.length > 0
                ? annualSales[0].total_sales
                  ? annualSales[0].total_sales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : '0'
                : '0'}
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={2} xs={2}>
            {/*annualSales[0].sales_growth_rate 는 증감률이다 - 면 빨간색 + 초록색으로 증감률을 표시해줘 +,- 기호와 함깨 */}
            {annualSales.length > 0 ? (
              <Typography variant="h4" color={annualSales[0].sales_growth_rate < 0 ? '#EF4770' : '#11B886'} textAlign="right">
                {annualSales[0].sales_growth_rate < 0 ? '- ' : '+ '}
                {Math.abs(annualSales[0].sales_growth_rate * 100).toFixed(0) + '%'}
              </Typography>
            ) : null}
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography variant="h4" color="inherit">
            (
            {annualSales.length > 0
              ? annualSales[0].profit
                ? annualSales[0].profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '0'
              : '0'}
            )
          </Typography>
        </Grid>
      </Stack>
    </MainCard>
  );
};

AnnualSales.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  color: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

AnnualSales.defaultProps = {
  color: 'primary'
};

export default AnnualSales;
