import axios from 'axios';
import { useAxiosStore, useLoaderStore } from 'store/cmnStore';
import { useSalesFetchStore } from 'store/salesStore';
import { usePurchaseFetchStore } from 'store/purchaseStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});
const excelService = {
  async uploadDataToDB(data, key1, key2) {
    try {
      data = data.filter((item) => item.length > 0); //빈 배열 제거

      //data 의 첫번째 행을 키값으로 사용

      let keys = [];
      if (key1 === 'sales') {
        keys = [
          'no',
          'sales_date',
          'business_name',
          'vendor_name',
          'product_name',
          'tax',
          'payment_name',
          'unit_price',
          'qty',
          'total_sales'
        ];
      } else if (key1 === 'purchase') {
        keys = ['issue_date', 'vendor_name', 'proof_name', 'total_amount', 'useage_name', 'contents', 'project', 'remarks'];
      }
      const values = data.slice(1);

      const result = values.map((value) => {
        const obj = {};
        keys.forEach((key, index) => {
          obj[key] = value[index];
        });
        return obj;
      });

      const response = await instance.post('/excel/upload', {
        data: result,
        key1: key1,
        key2: key2
      });
      useLoaderStore.getState().setIsLoading(false); //업로드가 완료되면 Loader를 비활성화합니다.
      // 업로드가 성공하면 서버에서 반환한 응답을 반환합니다.
      alert(response.data.message);

      //salesFetch 함수 호출
      if (key1 === 'sales') {
        useSalesFetchStore.getState().salesFetch();
      } else if (key1 === 'purchase') {
        usePurchaseFetchStore.getState().purchaseFetch();
      }
    } catch (error) {
      // 업로드 중 오류가 발생하면 오류를 콘솔에 기록하고 처리합니다.
      alert(error.response.data.message);
      useLoaderStore.getState().setIsLoading(false); //업로드가 완료되면 Loader를 비활성화합니다.
      return false;
    }
  }
};
export default excelService;
