import { create } from 'zustand';
import paymentService from 'services/paymentService';
import { useSelectedListStore } from './cmnStore';

//모달창을 관리하는 store
const usePaymentModalStore = create((set) => ({
  modalIsOpen: false,
  //모달창을 닫을 때 users 데이터를 초기화하는 함수
  setPaymentModalIsOpen: (isOpen) => {
    if (!isOpen) {
      usePaymentDataStore.getState().setPaymentData([]);
    }
    set({ modalIsOpen: isOpen });
  }
}));

//사업자 데이터를 저장하는 store
const usePaymentDataStore = create((set) => ({
  paymentData: [], // 사용자 데이터를 저장하는 배열
  setPaymentData: (data) => set({ paymentData: data }) // 사용자 데이터를 설정하는 함수
}));

//사업자 선택 데이터를 저장하는 store
const usePaymentDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await paymentService.deletePayment(data.payment_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    //paymentFetch 함수 호출
    usePaymentFetchStore.getState().paymentFetch();
  }
}));

//사업자 목록을 저장하는 store
const usePaymentListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

//payment 조회조건을 저장하는 store
const usePaymentSearchStore = create((set) => ({
  paymentSearch: {
    business_id: '',
    payment_name: '',
    startDate: ''
  },
  setPaymentSearch: (data) => set({ paymentSearch: data })
}));

//payment 조회 Store
const usePaymentFetchStore = create(() => ({
  paymentFetch: async () => {
    const paymentSearch = usePaymentSearchStore.getState().paymentSearch;
    const setListData = usePaymentListStore.getState().setListData;
    const data = await paymentService.fetchPaymentList(paymentSearch);
    setListData(data);
  }
}));

export {
  usePaymentModalStore,
  usePaymentDataStore,
  usePaymentDeleteStore,
  usePaymentListStore,
  usePaymentSearchStore,
  usePaymentFetchStore
};
