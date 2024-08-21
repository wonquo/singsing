import { create } from 'zustand';
import productService from 'services/productService';
import { useSelectedListStore } from './cmnStore';

//모달창을 관리하는 store
const useProductModalStore = create((set) => ({
  modalIsOpen: false,
  //모달창을 닫을 때 users 데이터를 초기화하는 함수
  setProductModalIsOpen: (isOpen) => {
    if (!isOpen) {
      useProductDataStore.getState().setProductData([]);
    }
    set({ modalIsOpen: isOpen });
  }
}));

//사업자 데이터를 저장하는 store
const useProductDataStore = create((set) => ({
  productData: [], // 사용자 데이터를 저장하는 배열
  setProductData: (data) => set({ productData: data }) // 사용자 데이터를 설정하는 함수
}));

//사업자 선택 데이터를 저장하는 store
const useProductDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await productService.deleteProduct(data.product_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    //paymentFetch 함수 호출
    useProductFetchStore.getState().productFetch();
  }
}));

//사업자 목록을 저장하는 store
const useProductListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

//product 조회조건을 저장하는 store
const useProductSearchStore = create((set) => ({
  productSearch: {
    business_id: '',
    product_gubun: '',
    product_code: ''
  },
  setProductSearch: (data) => set({ productSearch: data })
}));

//product 조회 Store
const useProductFetchStore = create(() => ({
  productFetch: async (type) => {
    const productSearch = useProductSearchStore.getState().productSearch;
    const setListData = useProductListStore.getState().setListData;
    if (type === 'B') {
      const data = await productService.fetchProductList('', '');
      setListData(data);
    } else {
      const data = await productService.fetchProductList(productSearch);
      setListData(data);
    }
  }
}));

export {
  useProductModalStore,
  useProductDataStore,
  useProductDeleteStore,
  useProductListStore,
  useProductSearchStore,
  useProductFetchStore
};
