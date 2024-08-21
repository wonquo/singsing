import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const salesService = {
  async addSales(salesData) {
    try {
      // MariaDB에 사용자 정보를 추가하는 API 호출
      await instance.post('/sales/insert', salesData);
      alert('추가되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },
  async fetchSalesList(params) {
    try {
      const response = await instance.get('/sales', {
        params
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async deleteSales(sales_id) {
    try {
      await instance.delete(`/sales/${sales_id}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async updateSales(salesData) {
    try {
      await instance.put(`/sales/${salesData.sales_id}`, salesData);
      alert('수정되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  async fetchMonthlySales(business_id) {
    try {
      const response = await instance.get('/sales/monthly', {
        params: {
          business_id
        }
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },
  //fetchMonthlySalesByBusiness
  async fetchMonthlySalesByBusiness(params) {
    try {
      const response = await instance.get('/sales/monthlyByBusiness', {
        params
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //fetchAnnualSales
  async fetchAnnualSales(params) {
    try {
      const response = await instance.get('/sales/annual', {
        params
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //fetchAnnualProfit
  async fetchAnnualProfit(params) {
    try {
      const response = await instance.get('/sales/annualProfit', {
        params
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //fetchMonthlySalesByVendor
  async fetchMonthlySalesByVendor(params) {
    try {
      const response = await instance.get('/sales/monthlyByVendor', { params });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //fetchVendorMonthlySales
  async fetchVendorMonthlySales(business_id, vendor_id) {
    try {
      const response = await instance.get('/sales/vendorMonthly', {
        params: {
          business_id,
          vendor_id
        }
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};

export default salesService;
