import { create } from 'zustand';
import vendorService from 'services/vendorService';
import { useSelectedListStore } from './cmnStore';

//모달창을 관리하는 store
const useVendorModalStore = create((set) => ({
  modalIsOpen: false,
  //모달창을 닫을 때 users 데이터를 초기화하는 함수
  setVendorModalIsOpen: (isOpen) => {
    if (!isOpen) {
      useVendorDataStore.getState().setVendorData([]);
    }
    set({ modalIsOpen: isOpen });
  }
}));

//사업자 데이터를 저장하는 store
const useVendorDataStore = create((set) => ({
  vendorData: [], // 사용자 데이터를 저장하는 배열
  setVendorData: (data) => set({ vendorData: data }) // 사용자 데이터를 설정하는 함수
}));

//사업자 선택 데이터를 저장하는 store
const useVendorDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await vendorService.deleteVendor(data.vendor_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    //paymentFetch 함수 호출
    useVendorFetchStore.getState().vendorFetch();
  }
}));

//사업자 목록을 저장하는 store
const useVendorListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

//vendor 조회조건을 저장하는 store
const useVendorSearchStore = create((set) => ({
  vendorSearch: {
    business_id: '',
    vendor_name: '',
    ceo: ''
  },
  setVendorSearch: (data) => set({ vendorSearch: data })
}));

//vendor 조회 Store
const useVendorFetchStore = create(() => ({
  vendorFetch: async (type) => {
    const vendorSearch = useVendorSearchStore.getState().vendorSearch;
    const setListData = useVendorListStore.getState().setListData;
    if (type === 'B') {
      const data = await vendorService.fetchVendorList('');
      setListData(data);
    } else {
      const data = await vendorService.fetchVendorList(vendorSearch);
      setListData(data);
    }
  }
}));

export { useVendorModalStore, useVendorDataStore, useVendorDeleteStore, useVendorListStore, useVendorSearchStore, useVendorFetchStore };
