import axios from 'axios';
import { defineStore } from 'pinia';

export const usePollStore = defineStore('pollStore', {
  state: () => ({
    currentPage: 1,
    totalPage: 0,
    allPolls: [],
    selectedSort: '-totalVoters',
    query: '',
    createdBy: '',
    status: '',
  }),
  getters: {
    visiblePages() {
      const totalPages = this.totalPage;
      const { currentPage } = this;

      // 第一頁的情況
      if (currentPage === 1) {
        return [1, 2, 3].filter((page) => page <= totalPages);
      }

      // 最後一頁的情況
      if (currentPage === totalPages) {
        return [totalPages - 2, totalPages - 1, totalPages].filter(
          (page) => page > 0,
        );
      }

      // 一般情況
      return [currentPage - 1, currentPage, currentPage + 1].filter(
        (page) => page > 0 && page <= totalPages,
      );
    },
  },
  actions: {
    async getPolls(page = 1) {
      const baseUrl = import.meta.env.VITE_APP_API_URL;
      const path = `/api/poll?page=${page}${
        this.status && `&status=${this.status}`
      }${this.selectedSort && `&sort=${this.selectedSort}`}${
        this.query && `&q=${this.query}`
      }${this.createdBy && `&createdBy=${this.createdBy}`}`;
      const { data } = await axios.get(`${baseUrl}${path}`);
      this.allPolls = data.polls;
      this.totalPage = data.totalPages;
      this.currentPage = data.page;
    },
    updateStatus(status) {
      this.status = status;
    },
    updateSelectedSort(sort) {
      this.selectedSort = sort;
    },
    updateQuery(query) {
      this.query = query;
    },
    updateCreatedBy(createdBy) {
      this.createdBy = createdBy;
    },
  },
});

export default usePollStore;
