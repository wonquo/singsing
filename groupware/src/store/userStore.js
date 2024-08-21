import { create } from 'zustand';
import userService from 'services/userService';
import { useSelectedListStore } from './cmnStore';

const useUserDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await userService.deleteUser(data.user_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    //paymentFetch 함수 호출
    useUserFetchStore.getState().userFetch();
  }
}));

const useModalStore = create((set) => ({
  modalIsOpen: false,
  //모달창을 닫을 때 users 데이터를 초기화하는 함수
  setModalIsOpen: (isOpen) => {
    if (!isOpen) {
      useUserStore.getState().setUsers([]);
    }
    set({ modalIsOpen: isOpen });
  }
}));

//사용자 데이터를 저장하는 store
const useUserStore = create((set) => ({
  users: [], // 사용자 데이터를 저장하는 배열
  setUsers: (data) => set({ users: data }) // 사용자 데이터를 설정하는 함수
}));

const useUserListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

const useUserSearchStore = create((set) => ({
  userSearch: {
    id: '',
    name: '',
    auth: ''
  },
  setUserSearch: (data) => set({ userSearch: data })
}));

//payment 조회 Store
const useUserFetchStore = create(() => ({
  userFetch: async () => {
    const userSearch = useUserSearchStore.getState().userSearch;
    const setListData = useUserListStore.getState().setListData;
    const data = await userService.getUsers(userSearch);
    setListData(data);
  }
}));

export { useUserDeleteStore, useModalStore, useUserStore, useUserListStore, useUserSearchStore, useUserFetchStore };
