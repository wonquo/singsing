import { create } from 'zustand';
import commonCodeService from 'services/commonCodeService';

//master code 조회 store
const useCommonCodeMasterFetchStore = create(() => ({
  commonCodeMasterFetch: async (params) => {
    const response = await commonCodeService.retrieveCommonCodeMasterList(params);
    useCommonCodeMasterListStore.getState().setMasterListData(response);
    if (response.length > 0) {
      useCommonCodeDetailFetchStore.getState().commonCodeDetailFetch(response[0].master_id);
    }
  }
}));

//detail code 조회 store
const useCommonCodeDetailFetchStore = create(() => ({
  commonCodeDetailFetch: async (master_id) => {
    const response = await commonCodeService.retrieveCommonCodeDetailList(master_id);
    useCommonCodeDetailListStore.getState().setDetailListData(response);
  }
}));

const useCommonCodeTransactionStore = create(() => ({
  commonCodeTransaction: async (type1, type2, commonCodeData) => {
    let result = false;
    if (type1 === 'master') {
      if (type2 === 'add') {
        result = await commonCodeService.addCommonCodeMaster(commonCodeData);
      } else if (type2 === 'update') {
        result = await commonCodeService.updateCommonCodeMaster(commonCodeData);
      } else if (type2 === 'delete') {
        result = await commonCodeService.deleteCommonCodeMaster(commonCodeData);
      }
      useCommonCodeMasterFetchStore.getState().commonCodeMasterFetch();
    } else if (type1 === 'detail') {
      if (type2 === 'add') {
        result = await commonCodeService.addCommonCodeDetail(commonCodeData);
      } else if (type2 === 'update') {
        result = await commonCodeService.updateCommonCodeDetail(commonCodeData);
      } else if (type2 === 'delete') {
        result = await commonCodeService.deleteCommonCodeDetail(commonCodeData);
      }
      useCommonCodeDetailFetchStore.getState().commonCodeDetailFetch(commonCodeData.master_id);
    }
    return result;
  }
}));

//마스터 코드 list store
const useCommonCodeMasterListStore = create((set) => ({
  masterListData: [],
  setMasterListData: (data) => set({ masterListData: data })
}));

//디테일 코드 list store
const useCommonCodeDetailListStore = create((set) => ({
  detailListData: [],
  setDetailListData: (data) => set({ detailListData: data })
}));

//useCommonCodeSearchStore
const useCommonCodeSearchStore = create((set) => ({
  commonCodeSearch: {
    code: '',
    name: ''
  },
  setCommonCodeSearch: (data) => set({ commonCodeSearch: data })
}));

export {
  useCommonCodeMasterFetchStore,
  useCommonCodeDetailFetchStore,
  useCommonCodeMasterListStore,
  useCommonCodeDetailListStore,
  useCommonCodeSearchStore,
  useCommonCodeTransactionStore
};
