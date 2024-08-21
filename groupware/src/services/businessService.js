import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const businessService = {
  async addBusiness(businessData) {
    try {
      // MariaDB에 사용자 정보를 추가하는 API 호출
      await instance.post('/business/insert', businessData);
      alert('사업자가 추가되었습니다.');
      return true;
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.message);
      } else {
        alert('저장에 실패했습니다.');
        throw new Error('사업자 저장에 실패했습니다.');
      }
    }
  },
  async retrieveBusinessList(business_code, business_name) {
    try {
      //param 에는 id, name, auth 가 담겨있음
      // parma 이 없으면 전체 사용자 목록을 조회
      const response = await instance.get('/business', {
        params: {
          business_code: business_code,
          business_name: business_name
        }
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async deleteBusiness(business_id) {
    try {
      await instance.delete(`/business/${business_id}`);
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  async updateBusiness(businessData) {
    try {
      await instance.put(`/business/${businessData.business_id}`, businessData);
      alert('수정되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
      throw new Error('사업자 수정에 실패했습니다.');
    }
  }
};

export default businessService;
