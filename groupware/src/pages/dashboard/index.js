import { useState, useEffect } from 'react';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

import IncomeAreaChart from './IncomeAreaChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import AnnualSales from 'components/cards/statistics/AnnualSales';
//ExpenseDash
import ExpenseDash from 'components/cards/statistics/ExpenseDash';
//businessStore import
import { useBusinessFetchStore } from 'store/businessStore';
//useBusinessFetchStore import
import { useSalesChartStore, useExpenseDashStore } from 'store/dashboardStore';
import MonthCal from 'components/MonthCal';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

/*대시보드 화면 */
const DashboardDefault = () => {
  const [slot, setSlot] = useState('');
  const [slotType, setSlotType] = useState(''); //eslint-disable-line no-unused-vars
  const {
    slotData,
    fetchMonthlySalesByBusiness,
    monthlySalesByBusiness,
    fetchAnnualSales,
    monthlySalesByVendorSearchParams,
    monthlySalesByVendor,
    monthlySalesByVendorBusinessName,
    fetchMonthlySalesByVendorInit,
    fetchMonthlySalesByVendor,
    fetchMonthlySales,
    searchParams,
    setSearchParams
  } = useSalesChartStore();

  const { fetchExpenseDash } = useExpenseDashStore();

  const { businessFetch } = useBusinessFetchStore();

  //화면 로딩시 데이터 조회
  useEffect(() => {
    businessFetch('B'); //거래처 조회
    fetchMonthlySalesByBusiness(); //월간 매출액 조회
    fetchAnnualSales();
    fetchExpenseDash();
    fetchMonthlySalesByVendorInit(); //거래선별 초기화
    fetchMonthlySales(''); //월간 매출액 조회
  }, []);

  const changeSlot = (id) => {
    setSlot(id);
    setSlotType(slotData.type);
  };

  const handleMonthCalChange = (date) => {
    setSearchParams({ ...searchParams, yyyy: date.slice(0, 4), mm: date.slice(5, 7) });
    fetchMonthlySalesByBusiness();
    fetchMonthlySalesByVendor(); //거래선별 초기화
  };
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      <Grid item key={'2'} xs={12} sm={8} md={6} lg={4}>
        <AnnualSales />
      </Grid>
      <Grid item key={'2'} xs={12} sm={8} md={6} lg={4}>
        <ExpenseDash />
      </Grid>

      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '25px', alignItems: 'center' }}>
          <Typography variant="h5">월간 매출액</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '200px', marginLeft: '20px' }}>
            <MonthCal value={searchParams.yyyy + '-' + searchParams.mm} onChange={(date) => handleMonthCalChange(date)} />
          </Box>
        </Box>
      </Grid>
      {monthlySalesByBusiness.map((item) => (
        <Grid item key={item.business_id} xs={12} sm={6} md={4} lg={2.4}>
          {/*4번째부터는 추가하지 않음 */}
          <AnalyticEcommerce
            business_id={item.business_id}
            date={item.sales_month}
            title={item.business_name}
            //count #,### 형식으로 변경
            count={item.total_sales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            rate={(item.sales_growth_rate * 100).toFixed(0)}
            businessYn="Y"
            profit={item.profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Grid>
      ))}
      {/* monthlySalesByVendorBusinessName이 있을 경우에만 렌더링 */}
      {monthlySalesByVendor.length > 0 && (
        <Grid item xs={12} md={7} lg={12}>
          <Typography variant="h5">{monthlySalesByVendorBusinessName} 거래처별 매출액</Typography>
        </Grid>
      )}

      {monthlySalesByVendor.map((item) => {
        // item.business_id와 const businessId를 비교하여 일치하는 경우에만 렌더링합니다.
        if (item.business_id === monthlySalesByVendorSearchParams.business_id) {
          return (
            <Grid item key={item.business_id} xs={4} sm={6} md={4} lg={2}>
              <AnalyticEcommerce
                date={item.sales_month}
                title={item.vendor_name}
                // count #,### 형식으로 변경
                count={item.total_sales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                rate={(item.sales_growth_rate * 100).toFixed(0)}
                businessYn="N"
              />
            </Grid>
          );
        }
        return null; // 조건이 맞지 않는 경우에는 null을 반환하여 렌더링하지 않습니다.
      })}
      {/* row 2 */}
      <Grid item xs={12} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Monthly Sales</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              {/*listData의 business_name 에 맞게 버튼 생성 */}
              <Button onClick={() => setSlot('')} color={!slot ? 'primary' : 'secondary'} variant={!slot ? 'outlined' : 'text'}>
                전체
              </Button>
              {slotData.list.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => changeSlot(item.id)}
                  color={slot === item.id ? 'primary' : 'secondary'}
                  variant={slot === item.id ? 'outlined' : 'text'}
                >
                  {item.name}
                </Button>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart type={slotType} slot={slot} />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
