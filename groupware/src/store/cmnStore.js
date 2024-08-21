import { create } from 'zustand';

//모달창을 관리하는 store
const useModalStore = create((set) => ({
  modalIsOpen: false,
  modalData: [],
  setModalData: (data) => set({ modalData: data }),
  setModalIsOpen: (isOpen) => {
    set({ modalIsOpen: isOpen });
  }
}));

//그리드에서 선택한 데이터를 관리하는 store
const useSelectedListStore = create((set) => ({
  selectedList: [],
  setSelectedList: (data) => set({ selectedList: data }),
  clearSelectedList: () => set({ selectedList: [] }),
  deleteSelectedList: () => {
    set({ selectedList: [] });
  }
}));

const useAxiosStore = create((set) => ({
  baseURL: 'http://localhost:3000/api',
  setBaseURL: (url) => set({ baseURL: url })
}));

//loader store
const useLoaderStore = create((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading })
}));

export { useModalStore, useSelectedListStore, useAxiosStore, useLoaderStore };
