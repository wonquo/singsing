import { Box, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import MonthCal from 'components/MonthCal';
import PropTypes from 'prop-types';
import { useExpenseDashStore } from 'store/dashboardStore';
import React, { useState } from 'react';

const ExpenseDash = () => {
  //useExpenseDashStore
  const { expenseSearchParams, setExpenseSearchParams, fetchExpenseDash, expenseDash } = useExpenseDashStore();

  const [monthCalValue, setMonthCalValue] = useState(new Date().toISOString().slice(0, 7));
  const handleCalChange = (date) => {
    setMonthCalValue(date);

    setExpenseSearchParams({ ...expenseSearchParams, yyyy: date.slice(0, 4), mm: date.slice(5, 7) });
    fetchExpenseDash();
  };

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', height: '25px' }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ marginTop: '5px' }}>
              {expenseDash.mm
                ? //yyyy-mm
                  expenseDash.yyyy + '-' + expenseDash.mm
                : expenseDash.yyyy}
            </Typography>
            <Box sx={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', width: '200px' }}>
              <MonthCal value={monthCalValue} onChange={(date) => handleCalChange(date)} monthType="전체" />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h5">경비 합계</Typography>
        </Grid>
        <Grid container>
          <Grid item lg={10} md={10} sm={10} xs={10}>
            <Typography variant="h4" color="inherit">
              {expenseDash.total_amount
                ? expenseDash.total_amount
                  ? expenseDash.total_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : '0'
                : '0'}
            </Typography>
          </Grid>

          <Grid item lg={2} md={2} sm={2} xs={2}>
            {/*expenseDash[0].sales_growth_rate 는 증감률이다 - 면 빨간색 + 초록색으로 증감률을 표시해줘 +,- 기호와 함깨 */}
            {expenseDash.total_amount ? (
              <Typography variant="h4" color={expenseDash.expense_grow_rate < 0 ? '#EF4770' : '#11B886'} textAlign="right">
                {expenseDash.expense_grow_rate < 0 ? '- ' : '+ '}
                {Math.abs(expenseDash.expense_grow_rate * 100).toFixed(0) + '%'}
              </Typography>
            ) : null}
          </Grid>
        </Grid>
        {/*profit 이 없어서 여백을 주기 위해 추가*/}

        <Grid item xs={12} sm={12} md={12} lg={12}>
          {/* 여백을 위한 빈 Grid 아이템 */}
          <Box sx={{ height: '25px' }} />
        </Grid>
      </Stack>
    </MainCard>
  );
};

ExpenseDash.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  color: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

ExpenseDash.defaultProps = {
  color: 'primary'
};

export default ExpenseDash;
