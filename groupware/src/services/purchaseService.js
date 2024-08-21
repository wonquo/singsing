import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const purchaseService = {
  async addPurchase(purchaseData) {
    try {
      // MariaDB에 사용자 정보를 추가하는 API 호출
      await instance.post('/purchase/insert', purchaseData);
      alert('추가되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },
  async fetchPurchaseList(params) {
    try {
      const response = await instance.get('/purchase', {
        params
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async deletePurchase(purchase_id) {
    try {
      await instance.delete(`/purchase/${purchase_id}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async updatePurchase(purchaseData) {
    try {
      //쉼표 제거
      await instance.put(`/purchase/${purchaseData.purchase_id}`, purchaseData);
      alert('수정되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  //fetchPurchaseVendorList
  //거래처 목록을 조회하는 API 호출
  async fetchPurchaseVendorList() {
    try {
      const response = await instance.get('/purchase/purchaseVendor');
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};

export default purchaseService;
