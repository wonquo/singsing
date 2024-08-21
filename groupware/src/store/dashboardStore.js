import { create } from 'zustand';
import salesService from 'services/salesService';
import expenseService from 'services/expenseService';

//salse chart data를 조회하는 함수

const useSalesChartStore = create((set) => ({
  searchParams: {
    yyyy: new Date().getFullYear().toString(),
    mm: new Date().getMonth() < 10 ? '0' + new Date().getMonth().toString() : new Date().getMonth().toString()
  },
  setSearchParams: (data) => set({ searchParams: data }),

  monthlySales: [],
  fetchMonthlySales: async (business_id) => {
    const response = await salesService.fetchMonthlySales(business_id);
    set({ monthlySales: response });

    //response의 중복 제거된 business_id, business_name을 slot.list에 id, name으로 저장
    const businessList = response.map((item) => ({ id: item.business_id, name: item.business_name }));
    const uniqueBusinessList = businessList.filter((item, index) => businessList.findIndex((t) => t.id === item.id) === index);
    set({ slotData: { type: 'business', list: uniqueBusinessList } });
  },
  monthlySalesByBusiness: [],
  fetchMonthlySalesByBusiness: async () => {
    const searchParams = useSalesChartStore.getState().searchParams;
    const response = await salesService.fetchMonthlySalesByBusiness(searchParams);
    set({ monthlySalesByBusiness: response });
  },
  monthlySearchParams: {
    date: new Date().toISOString().slice(0, 7)
  },

  //거래처 차트 조회
  fetchVendorMonthlySales: async (business_id, vendor_id) => {
    const response = await salesService.fetchVendorMonthlySales(business_id, vendor_id);
    set({ monthlySales: response });

    //response의 중복 제거된 business_id, business_name을 slot.list에 id, name으로 저장
    const businessList = response.map((item) => ({ id: item.business_id, name: item.business_name }));
    const uniqueBusinessList = businessList.filter((item, index) => businessList.findIndex((t) => t.id === item.id) === index);
    set({ slotData: { type: 'vendor', list: uniqueBusinessList } });
  },

  slotData: {
    type: 'business',
    list: []
  },

  /*========== 연간 매출액 조회 ==========*/
  annualSales: [],
  fetchAnnualSales: async () => {
    const anualSearchParams = useSalesChartStore.getState().annualSearchParams;
    const response = await salesService.fetchAnnualSales(anualSearchParams);

    //annualSales에 profit 추가
    const response2 = await salesService.fetchAnnualProfit(anualSearchParams);
    response[0].profit = response2[0].profit;

    set({ annualSales: response });
  },

  annualSearchParams: {
    business_id: 'all',
    //yyyy 의 초기값은 현재 년도로 설정
    yyyy: new Date().getFullYear().toString()
  },

  setAnnualSearchParams: (data) => set({ annualSearchParams: data }),

  /*========== 거래처별 매출액 조회 ==========*/

  //조회
  monthlySalesByVendor: [],
  fetchMonthlySalesByVendor: async () => {
    const monthlySalesByVendorSearchParams = useSalesChartStore.getState().monthlySalesByVendorSearchParams; //조회조건
    const searchParams = useSalesChartStore.getState().searchParams; //조회조건
    monthlySalesByVendorSearchParams.yyyy = searchParams.yyyy;
    monthlySalesByVendorSearchParams.mm = searchParams.mm;
    const response = await salesService.fetchMonthlySalesByVendor(monthlySalesByVendorSearchParams); //조회
    set({ monthlySalesByVendor: response }); //return

    //monthlySalesByVendor 의 business_name 첫번째 데이터를 monthlySalesByVendorBusinessName에 저장
    if (response.length > 0) {
      useSalesChartStore.getState().setMonthlySalesByVendorBusinessName(response[0].business_name);
    }
  },

  //조회조건
  monthlySalesByVendorSearchParams: {
    business_id: ''
  },
  setMonthlySalesByVendorSearchParams: (data) => set({ monthlySalesByVendorSearchParams: data }),

  //초기화
  fetchMonthlySalesByVendorInit: async () => {
    set({ monthlySalesByVendor: [] });
    useSalesChartStore.getState().setMonthlySalesByVendorBusinessName('');
  },
  //사업자명
  monthlySalesByVendorBusinessName: '',
  setMonthlySalesByVendorBusinessName: (data) => set({ monthlySalesByVendorBusinessName: data })

  /*========== 거래처별 연간 매출액 조회 ==========*/
}));

const useExpenseDashStore = create((set) => ({
  /*========== 경비 매출액 조회 ==========*/
  expenseSearchParams: {
    yyyy: new Date().getFullYear().toString(),
    mm: new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString()
  },
  setExpenseSearchParams: (data) => set({ expenseSearchParams: data }),
  //경비 합계 조회
  expenseDash: [],
  setExpenseDash: (data) => set({ expenseDash: data }),
  fetchExpenseDash: async () => {
    const response = await expenseService.fetchExpenseDash(useExpenseDashStore.getState().expenseSearchParams);
    set({ expenseDash: response });
    //expenseDash 로그
  }
}));

export { useSalesChartStore, useExpenseDashStore };
