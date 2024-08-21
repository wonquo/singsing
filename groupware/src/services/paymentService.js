import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const paymentService = {
  async addPayment(paymentData) {
    try {
      // MariaDB에 사용자 정보를 추가하는 API 호출
      await instance.post('/payment/insert', paymentData);
      alert('추가되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },
  async fetchPaymentList(params) {
    try {
      const response = await instance.get('/payment', {
        params
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async deletePayment(payment_id) {
    try {
      await instance.delete(`/payment/${payment_id}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async updatePayment(paymentData) {
    try {
      await instance.put(`/payment/${paymentData.payment_id}`, paymentData);
      alert('수정되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  }
};

export default paymentService;
