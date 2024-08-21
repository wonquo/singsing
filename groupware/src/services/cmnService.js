import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const cmnService = {
  //공통코드 조회
  async fetchCommonCodeList(params) {
    try {
      const response = await instance.get('/cmn/CommonCode', {
        params
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};

export default cmnService;
