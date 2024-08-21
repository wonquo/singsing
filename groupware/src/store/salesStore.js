import { create } from 'zustand';
import salesService from 'services/salesService';
import { useSelectedListStore } from './cmnStore';
import { useVendorListStore } from './vendorStore';
import { useProductListStore } from './productStore';

//모달창을 관리하는 store
const useSalesModalStore = create((set) => ({
  modalIsOpen: false,
  //모달창을 닫을 때 users 데이터를 초기화하는 함수
  setSalesModalIsOpen: (isOpen) => {
    if (!isOpen) {
      useSalesDataStore.getState().setSalesData([]);
    }
    set({ modalIsOpen: isOpen });
  }
}));

//사업자 데이터를 저장하는 store
const useSalesDataStore = create((set) => ({
  salesData: [], // 사용자 데이터를 저장하는 배열
  setSalesData: (data) => set({ salesData: data }) // 사용자 데이터를 설정하는 함수
}));

//사업자 선택 데이터를 저장하는 store
const useSalesDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await salesService.deleteSales(data.sales_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    //salesFetch 함수 호출
    useSalesFetchStore.getState().salesFetch();
  }
}));

//사업자 목록을 저장하는 store
const useSalesListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

//sales 조회조건을 저장하는 store
const useSalesSearchStore = create((set) => ({
  salesSearch: {
    business_id: '',
    vendor_name: '',
    from_date: '',
    to_date: ''
  },
  setSalesSearch: (data) => set({ salesSearch: data })
}));

//sales 조회 Store
const useSalesFetchStore = create(() => ({
  salesFetch: async () => {
    const salesSearch = useSalesSearchStore.getState().salesSearch;
    //fromDate 가 toDate 보다 큰 경우 경고창을 띄우고 함수를 종료
    if (salesSearch.from_date > salesSearch.to_date) {
      alert('조회기간의 시작일자가 종료일자보다 큽니다.');
      return;
    }
    const setListData = useSalesListStore.getState().setListData;
    const data = await salesService.fetchSalesList(salesSearch);
    setListData(data);
  }
}));

const useSalesSelectListStore = create(() => ({
  business_id: '',
  setBusinessId: (data) => set({ business_id: data }),
  selectListFetch: async () => {
    const fetechParams = {
      business_id: business_id
    };
    const setVendorListData = useVendorListStore.getState().setListData;
    const setProductListData = useProductListStore.getState().setListData;
    const [vendorData, productData] = await Promise.all([
      vendorService.fetchVendorList(fetechParams),
      productService.fetchProductList(fetechParams)
    ]);
    setVendorListData(vendorData);
    setProductListData(productData);
  }
}));

export {
  useSalesModalStore,
  useSalesDataStore,
  useSalesDeleteStore,
  useSalesListStore,
  useSalesSearchStore,
  useSalesFetchStore,
  useSalesSelectListStore
};
