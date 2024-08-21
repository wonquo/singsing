import { create } from 'zustand';
import purchaseService from 'services/purchaseService';
import { useSelectedListStore } from './cmnStore';
import dayjs from 'dayjs';
import cmnService from 'services/cmnService';

//모달창을 관리하는 store
const usePurchaseModalStore = create((set) => ({
  modalIsOpen: false,
  //모달창을 닫을 때 users 데이터를 초기화하는 함수
  setPurchaseModalIsOpen: (isOpen) => {
    if (!isOpen) {
      usePurchaseDataStore.getState().setPurchaseData([]);
    }
    set({ modalIsOpen: isOpen });
  }
}));

//사업자 데이터를 저장하는 store
const usePurchaseDataStore = create((set) => ({
  purchaseData: [], // 사용자 데이터를 저장하는 배열
  setPurchaseData: (data) => set({ purchaseData: data }) // 사용자 데이터를 설정하는 함수
}));

//사업자 선택 데이터를 저장하는 store
const usePurchaseDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await purchaseService.deletePurchase(data.purchase_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    //purchaseFetch 함수 호출
    usePurchaseFetchStore.getState().purchaseFetch();
  }
}));

//사업자 목록을 저장하는 store
const usePurchaseListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

//purchase 조회조건을 저장하는 store
const usePurchaseSearchStore = create((set) => ({
  purchaseSearch: {
    business_id: '',
    vendor_name: '',
    from_date: dayjs().subtract(3, 'month'), //from_date 는 3개월 전
    to_date: dayjs()
  },
  setPurchaseSearch: (data) => set({ purchaseSearch: data })
}));

//purchase 조회 Store
const usePurchaseFetchStore = create(() => ({
  purchaseFetch: async () => {
    const purchaseSearch = usePurchaseSearchStore.getState().purchaseSearch;
    const setListData = usePurchaseListStore.getState().setListData;
    const data = await purchaseService.fetchPurchaseList(purchaseSearch);
    setListData(data);
  }
}));

const usePurchaseCodeStore = create((set) => ({
  //증빙(PURCHASE_PROOF) 목록을 저장하는 배열
  purchaseProofList: [],
  setPurchaseProofList: (data) => set({ purchaseProofList: data }),
  fetchPurchaseProofList: async () => {
    const data = await cmnService.fetchCommonCodeList({ master_code: 'PURCHASE_PROOF' }); //증빙 조회
    set({ purchaseProofList: data });
  },

  //용도(PURCHASE_USEAGE) 목록을 저장하는 배열
  purchaseUseageList: [],
  setPurchaseUseageList: (data) => set({ purchaseUseageList: data }),
  fetchPurchaseUseageList: async () => {
    const data = await cmnService.fetchCommonCodeList({ master_code: 'PURCHASE_USEAGE' }); //용도 조회
    set({ purchaseUseageList: data });
  }
}));

export {
  usePurchaseModalStore,
  usePurchaseDataStore,
  usePurchaseDeleteStore,
  usePurchaseListStore,
  usePurchaseSearchStore,
  usePurchaseFetchStore,
  usePurchaseCodeStore //경비 거래처(공통코드) 조회 store
};
