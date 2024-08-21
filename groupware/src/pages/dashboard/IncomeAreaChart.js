import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

import { useSalesChartStore } from 'store/dashboardStore';
// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ type, slot }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text; // eslint-disable-line no-unused-vars
  const line = theme.palette.divider;

  //fetchMonthlySalesData 함수 추가
  const { fetchMonthlySales, monthlySales, fetchVendorMonthlySales, monthlySalesByVendorSearchParams } = useSalesChartStore();
  const [options, setOptions] = useState(areaChartOptions);

  const [series, setSeries] = useState([]);
  useEffect(() => {
    if (type === 'business') {
      fetchMonthlySales(slot);
    } else {
      let bi = monthlySalesByVendorSearchParams.business_id;
      fetchVendorMonthlySales(bi, slot);
    }
  }, [slot, fetchMonthlySales]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories:
          //slot 별로 x축에 표시할 데이터를 변경
          monthlySales.map((item) => item.sales_month),

        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 100
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          },

          formatter: (value) => {
            return new Intl.NumberFormat('en').format(value);
          }
        }
      },
      grid: {
        borderColor: line,
        //높이 변경
        padding: {
          top: 50,
          bottom: 50
        }
      },
      tooltip: {
        theme: 'light',
        custom: function ({ series, dataPointIndex, w }) {
          // eslint-disable-line no-unused-vars
          const category = w.globals.categoryLabels[dataPointIndex];
          let seriesData = series.map((s, index) => ({
            label: w.config.colors[index],
            name: w.config.series[index].name,
            value: s[dataPointIndex]
          }));

          //seriesData 길이
          //seriesData에서 item.value가 undefined인 경우가 있어서 undefined인 경우는 제외
          seriesData = seriesData.filter((item) => item.value !== undefined);
          let tooltipContent = ``;
          if (seriesData.length > 10) {
            seriesData.forEach((item, index) => {
              if (index % 2 === 0) {
                tooltipContent +=
                  `<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; display: flex;">` +
                  //label 색상을 표시하기 위해 span 추가
                  `<div style="width: 10px; height: 10px; background-color: ${item.label};border-radius: 50%; margin-left:10px; margin-top:4px; margin-right: 5px;"></div>` +
                  `<div style="width: 100px; margin-right: 10px;">` +
                  `<span class="apexcharts-tooltip-text-y-label">${item.name} </span>` +
                  `</div>` +
                  `<div style="width: 100px; maring-left:2px; margin-right: 20px;">` +
                  `<span style="font-weight: bold;"> :</span>` +
                  `<span class="apexcharts-tooltip-text-y-value" style="width:100%; text-align: right;">${new Intl.NumberFormat('en').format(item.value)}</span>` +
                  `</div>`;
                //last index
                if (index === seriesData.length - 1) {
                  tooltipContent += `</div>`;
                }
              } else {
                tooltipContent +=
                  `<div style="width: 10px; height: 10px; background-color: ${item.label};border-radius: 50%; margin-left:10px; margin-top:4px; margin-right: 5px;"></div>` +
                  `<div style="width: 100px; margin-right: 10px;">` +
                  `<span class="apexcharts-tooltip-text-y-label">${item.name} </span>` +
                  `</div>` +
                  `<div style="width: 100px; maring-left:2px; margin-right: 10px;">` +
                  `<span style="font-weight: bold;"> :</span>` +
                  `<span class="apexcharts-tooltip-text-y-value" style="width:100%; text-align: right;">${new Intl.NumberFormat('en').format(item.value)}</span>` +
                  `</div></div>`;
              }
            });
          } else {
            seriesData.forEach((item) => {
              tooltipContent +=
                `<div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; display: flex;">` +
                //label 색상을 표시하기 위해 span 추가
                `<div style="width: 10px; height: 10px; background-color: ${item.label};border-radius: 50%; margin-left:10px; margin-top:4px; margin-right: 5px;"></div>` +
                `<div style="width: 100px; margin-right: 10px;">` +
                `<span class="apexcharts-tooltip-text-y-label">${item.name} </span>` +
                `</div>` +
                `<div style="width: 100px; maring-left:2px; margin-right: 20px;">` +
                `<span style="font-weight: bold;"> :</span>` +
                `<span class="apexcharts-tooltip-text-y-value" style="width:100%; text-align: right;">${new Intl.NumberFormat('en').format(item.value)}</span>` +
                `</div></div>`;
            });
          }

          let tooltipWidth = 0;
          if (seriesData.length > 10) {
            tooltipWidth = 540;
          } else {
            tooltipWidth = 300;
          }
          return (
            `<div display: flex; flex-direction: column; style="width: ${tooltipWidth}px; background-color: #fff; border: 1px solid #e3e3e3; border-radius: 5px; box-shadow: 0px 0px 10px 0px #e3e3e3; padding: 10px; font-family: Helvetica, Arial, sans-serif; font-size: 12px; display: flex; flex-direction: column;">` +
            '<div class="apexcharts-tooltip-title">' +
            //x축에 표시할 데이터를 tooltip에 표시
            category +
            '</div>' +
            tooltipContent +
            `</div>`
          );
        }
      },
      //차트 높이 변경
      chart: {
        height: '100px'
      }
    }));

    const seriesData = [];

    //차트에 series 별로 색상을 지정하기 위해 색상 배열을 만들어줌
    const colors = [
      theme.palette.primary.main,
      theme.palette.primary[700],
      theme.palette.secondary.main,
      theme.palette.secondary.light,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.primary.light,
      theme.palette.primary.dark,
      theme.palette.secondary.light,
      theme.palette.secondary.dark,
      theme.palette.error.light,
      theme.palette.error.dark,
      theme.palette.warning.light,
      theme.palette.warning.dark,
      theme.palette.info.light,
      theme.palette.info.dark,
      theme.palette.success.light,
      theme.palette.success.dark,
      theme.palette.primary.light,
      theme.palette.primary.dark,
      theme.palette.secondary.dark,
      theme.palette.error.light,
      theme.palette.error.dark,
      theme.palette.warning.light
    ];

    monthlySales.forEach((item) => {
      const existingSeriesIndex = seriesData.findIndex((element) => element.name === item.business_name);

      if (existingSeriesIndex === -1) {
        seriesData.push({ name: item.business_name, total_sales: [item.total_sales], color: colors[seriesData.length] });
      } else {
        seriesData[existingSeriesIndex].total_sales.push(item.total_sales);
      }
    });
    setSeries(
      seriesData.map((item) => ({
        name: item.name,
        data: item.total_sales,
        color: item.color
      }))
    );
  }, [monthlySales, slot, theme, line, secondary]);

  return <ReactApexChart options={options} series={series} type="area" height={600} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
