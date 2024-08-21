import { create } from 'zustand';
import businessService from 'services/businessService';
import { useSelectedListStore } from './cmnStore';

const useBusinessStore = create((set) => ({
  businessData: [], // 사용자 데이터를 저장하는 배열
  setBusinessData: (data) => set({ businessData: data }) // 사용자 데이터를 설정하는 함수
}));

const useBusinessDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await businessService.deleteBusiness(data.business_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    //paymentFetch 함수 호출
    useBusinessFetchStore.getState().paymentFetch();
  }
}));

//사업자 목록을 저장하는 store
const useBusinessListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

//business 조회조건을 저장하는 store
const useBusinessSearchStore = create((set) => ({
  businessSearch: {
    business_id: '',
    business_code: '',
    business_name: ''
  },
  setBusinessSearch: (data) => set({ businessSearch: data })
}));

//business를 조회하는 store
const useBusinessFetchStore = create(() => ({
  businessFetch: async (type) => {
    const businessSearch = useBusinessSearchStore.getState().businessSearch;
    const setListData = useBusinessListStore.getState().setListData;
    //type : B 는 전체 조회
    if (type === 'B') {
      const data = await businessService.retrieveBusinessList('', '');
      setListData(data);
    } else {
      const data = await businessService.retrieveBusinessList(businessSearch.business_code, businessSearch.business_name);
      setListData(data);
    }
  }
}));

//메뉴에서 사용할 store를 export
const useBusinessMenuStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data }),
  businessMenuFetch: async () => {
    const setListData = useBusinessMenuStore.getState().setListData;
    const data = await businessService.retrieveBusinessList('', '');
    setListData(data);
  }
}));

export {
  useBusinessStore,
  useBusinessDeleteStore,
  useBusinessListStore,
  useBusinessSearchStore,
  useBusinessFetchStore,
  useBusinessMenuStore
};
