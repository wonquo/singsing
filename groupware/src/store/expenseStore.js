import { create } from 'zustand';
import expenseService from 'services/expenseService';
import { useSelectedListStore } from './cmnStore';
import dayjs from 'dayjs';

//모달창을 관리하는 store
const useExpenseModalStore = create((set) => ({
  modalIsOpen: false,
  //모달창을 닫을 때 users 데이터를 초기화하는 함수
  setExpenseModalIsOpen: (isOpen) => {
    if (!isOpen) {
      useExpenseDataStore.getState().setExpenseData([]);
    }
    set({ modalIsOpen: isOpen });
  }
}));

//사업자 데이터를 저장하는 store
const useExpenseDataStore = create((set) => ({
  expenseData: [], // 사용자 데이터를 저장하는 배열
  setExpenseData: (data) => set({ expenseData: data }) // 사용자 데이터를 설정하는 함수
}));

//사업자 선택 데이터를 저장하는 store
const useExpenseDeleteStore = create(() => ({
  deleteSelectedList: async () => {
    const selectedList = useSelectedListStore.getState().selectedList;
    await Promise.all(
      selectedList.map(async (data) => {
        await expenseService.deleteExpense(data.expense_id);
      })
    );
    alert('삭제되었습니다.');
    useSelectedListStore.getState().clearSelectedList();

    //expenseFetch 함수 호출
    useExpenseFetchStore.getState().expenseFetch();
  }
}));

//사업자 목록을 저장하는 store
const useExpenseListStore = create((set) => ({
  listData: [],
  setListData: (data) => set({ listData: data })
}));

//expense 조회조건을 저장하는 store
const useExpenseSearchStore = create((set) => ({
  expenseSearch: {
    expense_vendor_name: '',
    //from_date 는 3개월 전
    from_date: dayjs().subtract(3, 'month'),
    to_date: dayjs()
  },
  setExpenseSearch: (data) => set({ expenseSearch: data })
}));

//expense 조회 Store
const useExpenseFetchStore = create(() => ({
  expenseFetch: async () => {
    const expenseSearch = useExpenseSearchStore.getState().expenseSearch;
    const setListData = useExpenseListStore.getState().setListData;
    const data = await expenseService.fetchExpenseList(expenseSearch);
    setListData(data);
  }
}));

const useExpenseVendorStore = create((set) => ({
  expenseVendorList: [],
  setExpenseVendorList: (data) => set({ expenseVendorList: data }),
  fetchExpenseVendorList: async () => {
    const data = await expenseService.fetchExpenseVendorList();
    set({ expenseVendorList: data });
  }
}));

export {
  useExpenseModalStore,
  useExpenseDataStore,
  useExpenseDeleteStore,
  useExpenseListStore,
  useExpenseSearchStore,
  useExpenseFetchStore,
  useExpenseVendorStore //경비 거래처(공통코드) 조회 store
};
