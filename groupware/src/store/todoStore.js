import { create } from 'zustand';
import todoService from 'services/todoService';
import { useSelectedListStore } from './cmnStore';
import dayjs from 'dayjs';

// 모달창을 관리하는 store
const useTodoModalStore = create((set) => ({
  modalIsOpen: false,
  // 모달창을 닫을 때 todo 데이터를 초기화하는 함수
  setTodoModalIsOpen: (isOpen) => {
    if (!isOpen) {
      useTodoDataStore.getState().setTodoData([]);
    }
    set({ modalIsOpen: isOpen });
  }
}));

// 할 일 데이터를 저장하는 store
const useTodoDataStore = create((set) => ({
  todoData: [], // 할 일 데이터를 저장하는 배열
  setTodoData: (data) => set({ todoData: data }) // 할 일 데이터를 설정하는 함수
}));

// 할 일 삭제를 처리하는 store
const useTodoDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await todoService.deleteTodoMaster(data.todo_master_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    // todoFetch 함수 호출
    useTodoFetchStore.getState().todoFetch();
  }
}));

// 할 일 목록을 저장하는 store
const useTodoListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

// 할 일 조회 조건을 저장하는 store
const useTodoSearchStore = create((set) => ({
  todoSearch: {
    subject: '',
    // from_date 는 3개월 전
    from_date: dayjs().subtract(3, 'month'),
    to_date: dayjs()
  },
  setTodoSearch: (data) => set({ todoSearch: data })
}));

// 할 일 조회 Store
const useTodoFetchStore = create(() => ({
  todoFetch: async () => {
    const todoSearch = useTodoSearchStore.getState().todoSearch;
    const setListData = useTodoListStore.getState().setListData;
    const data = await todoService.fetchTodoList(todoSearch);
    setListData(data);
  }
}));

//디테일 todo fetch store
const useTodoDetailFetchStore = create(() => ({
  todoDetailFetch: async (todo_master_id) => {
    const setDetailListData = useTodoDetailListStore.getState().setDetailListData;
    const data = await todoService.fetchTodoDetail(todo_master_id);
    setDetailListData(data);
  }
}));

//디테일 코드 list store
const useTodoDetailListStore = create((set) => ({
    detailListData: [],
    setDetailListData: (data) => set({ detailListData: data })
  }));

export {
  useTodoModalStore,
  useTodoDataStore,
  useTodoDeleteStore,
  useTodoListStore,
  useTodoSearchStore,
  useTodoFetchStore,
  useTodoDetailFetchStore, // 할 일 거래처(공통코드) 조회 store
useTodoDetailListStore

};
