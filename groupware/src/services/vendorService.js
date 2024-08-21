import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const vendorService = {
  async addVendor(vendorData) {
    try {
      // MariaDB에 사용자 정보를 추가하는 API 호출
      await instance.post('/vendor/insert', vendorData);
      alert('추가되었습니다.');
      return true;
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.message);
      } else {
        alert(error.response.data.message);
      }
      return false;
    }
  },
  async fetchVendorList(params) {
    try {
      const response = await instance.get('/vendor', {
        params
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async deleteVendor(vendor_id) {
    try {
      await instance.delete(`/vendor/${vendor_id}`);
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  async updateVendor(vendorData) {
    try {
      await instance.put(`/vendor/${vendorData.vendor_id}`, vendorData);
      alert('수정되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  }
};

export default vendorService;
