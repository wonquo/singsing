import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const loginService = {
  //login post 요청
  async login(userData) {
    try {
      const response = await instance.post('/login/login', userData); //eslint-disable-line
      return true;
    } catch (error) {
      alert(error.response.data.message);
    }
  },
  //userInfo get 요청
  async getUserInfo() {
    try {
      //withCredentials: true를 설정하여 쿠키를 전송
      const response = await instance.get('/login/userInfo', { withCredentials: true }); //eslint-disable-line
      return true;
    } catch (error) {
      return false;
    }
  }
};
export default loginService;
