import { defineStore } from 'pinia';

export default defineStore('dateStore', {
  state: () => ({}),
  actions: {
    turnDate(time) {
      // 時間格式轉換 YYYY-MM-DDTHH:mm:ss.sssZ → YYYY-MM-DD
      if (time === null || !time) {
        return '無期限';
      }
      const date = new Date(time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      return formattedDate;
    },
  },
});
