import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const userService = {
  async addUser(userData) {
    try {
      // MariaDB에 사용자 정보를 추가하는 API 호출
      await instance.post('/users/insert', userData);
      alert('저장되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
    }
  },
  async getUsers(params) {
    try {
      const response = await instance.get('/users', {
        params
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },
  //deleteUser 추가
  async deleteUser(id) {
    try {
      await instance.delete(`/users/${id}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //updateUser 추가
  async updateUser(userData) {
    try {
      await instance.put(`/users/${userData.user_id}`, userData);
      return true;
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};

export default userService;
