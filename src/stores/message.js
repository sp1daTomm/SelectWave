import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useMessageStore = defineStore('messageStore', {
  state: () => ({
    message: '',
    title: '',
  }),
  actions: {
    setMessage(data) {
      this.message = data.message;
      this.title = data.title || '';
    },
    showToast(status, icon) {
      if (status) {
        Swal.fire({
          icon: icon || 'success',
          title: this.title,
          text: this.message,
          toast: true,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          position: 'top-end',
        });
      }
    },
    showModal(icon) {
      Swal.fire({
        icon: icon || 'success',
        title: this.title,
        text: this.message,
      });
    },
    showConfirm() {
      return Swal.fire({
        title: this.title,
        text: this.message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F49E00',
        cancelButtonColor: '#1E1E1E',
        confirmButtonText: '是的',
        cancelButtonText: '取消',
      }).then((result) => {
        return result.isConfirmed;
      });
    },
    resetMessage() {
      this.message = '';
      this.title = '';
    },
    closeModel() {
      this.resetMessage();
      Swal.close();
    },
  },
});

export default useMessageStore;
