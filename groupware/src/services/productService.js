import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const productService = {
  async addProduct(productData) {
    try {
      // MariaDB에 사용자 정보를 추가하는 API 호출
      await instance.post('/product/insert', productData);
      alert('추가되었습니다.');
      return true;
    } catch (error) {
      if (error.response.status === 409) {
        alert(error.response.data.message);
      } else {
        alert(error.response.data.message);
      }
    }
  },
  async fetchProductList(params) {
    try {
      const response = await instance.get('/product', {
        params
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async deleteProduct(product_id) {
    try {
      await instance.delete(`/product/${product_id}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  async updateProduct(productData) {
    try {
      await instance.put(`/product/${productData.product_id}`, productData);
      alert('수정되었습니다.');
      return true;
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};

export default productService;
