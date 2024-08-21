import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const expenseService = {
  async addExpense(expenseData) {
    try {
      // MariaDB에 사용자 정보를 추가하는 API 호출
      await instance.post('/expense/insert', expenseData);
      alert('추가되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },
  async fetchExpenseList(params) {
    try {
      const response = await instance.get('/expense', {
        params
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async deleteExpense(expense_id) {
    try {
      await instance.delete(`/expense/${expense_id}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async updateExpense(expenseData) {
    try {
      //쉼표 제거
      await instance.put(`/expense/${expenseData.expense_id}`, expenseData);
      alert('수정되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  //fetchExpenseVendorList
  //거래처 목록을 조회하는 API 호출
  async fetchExpenseVendorList() {
    try {
      const response = await instance.get('/expense/expenseVendor');
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //dash
  async fetchExpenseDash(params) {
    try {
      const response = await instance.get('/expense/expenseDash', {
        params
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};

export default expenseService;
