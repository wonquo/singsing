import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const commonCodeService = {
  //마스터 코드 조회
  async retrieveCommonCodeMasterList(params) {
    try {
      const response = await instance.get('/commonCode/master', { params });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //디테일 코드 조회
  async retrieveCommonCodeDetailList(master_id) {
    try {
      const response = await instance.get(`/commonCode/detail/${master_id}`);
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //마스터 코드 추가
  async addCommonCodeMaster(commonCodeData) {
    try {
      await instance.post('/commonCode/master', commonCodeData);
      return true;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //디테일 코드 추가
  async addCommonCodeDetail(commonCodeData) {
    try {
      await instance.post('/commonCode/detail', commonCodeData);
      return true;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  //마스터 코드 삭제
  async deleteCommonCodeMaster(master_id) {
    try {
      await instance.delete(`/commonCode/master/${master_id}`);
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  //디테일 코드 삭제
  async deleteCommonCodeDetail(detail_id) {
    try {
      await instance.delete(`/commonCode/detail/${detail_id}`);
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  //마스터 코드 수정
  async updateCommonCodeMaster(commonCodeData) {
    try {
      await instance.put(`/commonCode/master/${commonCodeData.master_id}`, commonCodeData);
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  //디테일 코드 수정
  async updateCommonCodeDetail(commonCodeData) {
    try {
      await instance.put(`/commonCode/detail/${commonCodeData.detail_id}`, commonCodeData);
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  }
};

export default commonCodeService;
