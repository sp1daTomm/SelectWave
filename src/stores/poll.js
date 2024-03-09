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
      const path = `/api/poll?status=active&page=${page}${this.selectedSort && `&sort=${this.selectedSort}`}${
        this.query && `&q=${this.query}`
      }${this.createdBy && `&createdBy=${this.createdBy}`}`;
      const { data } = await axios.get(`${baseUrl}${path}`);
      this.allPolls = data.polls;
      this.totalPage = data.totalPages;
      this.currentPage = data.page;
    },
    updateSelectedSort(sort) {
      this.selectedSort = sort;
      this.getPolls(1); // 更新篩選後，重新取得第一頁資料
    },
    updateQuery(query) {
      this.query = query;
      this.getPolls(1); // 更新篩選後，重新取得第一頁資料
    },
    updateCreatedBy(createdBy) {
      this.createdBy = createdBy;
      this.getPolls(1); // 更新篩選後，重新取得第一頁資料
    },
  },
});

export default usePollStore;
