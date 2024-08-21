import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';

const instance = axios.create({
  baseURL: useAxiosStore.getState().baseURL
});

const todoService = {
  async insertTodoMaster(todoData) {
    try {
      // MariaDB에 할 일 정보를 추가하는 API 호출
      const response = await instance.post('/todo/insertMaster', todoData);
      return response;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  async insertTodoDetail(todoData) {
    try {
      // MariaDB에 할 일 상세 정보를 추가하는 API 호출
      await instance.post('/todo/insertDetail', todoData);
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  async deleteTodoDetail(todo_master_id) {
    try {
      // MariaDB에 할 일 상세 정보를 삭제하는 API 호출
      await instance.delete(`/todo/deleteDetail/${todo_master_id}`);
      return true;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },


  async fetchTodoList(params) {
    try {
      const response = await instance.get('/todo', {
        params
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },
  
  async fetchTodoDetail(todo_master_id) {
    try {
      const response = await instance.get(`/todo/todoDetail/${todo_master_id}`);
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },


  async deleteTodoMaster(todo_master_id) {
    try {
      await instance.delete(`/todo/${todo_master_id}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  },


  async updateTodoMaster(todoData) {
    try {
      // 쉼표 제거
      const response = await instance.put(`/todo/${todoData.todo_master_id}`, todoData);
      return response;
    } catch (error) {
      alert(error.response.data.message);
      return false;
    }
  },

  // fetchTodoVendorList
  // 거래처 목록을 조회하는 API 호출
  async fetchTodoVendorList() {
    try {
      const response = await instance.get('/todo/todoVendor');
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  },

  // dash
  async fetchTodoDash(params) {
    try {
      const response = await instance.get('/todo/todoDash', {
        params
      });
      return response.data;
    } catch (error) {
      alert(error.response.data.message);
    }
  }
};

export default todoService;
