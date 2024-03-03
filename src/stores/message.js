import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useMessageStore = defineStore('memberStatus', {
  state: () => ({
    message: '',
    title: '',
  }),
  actions: {
    setMessage(data) {
      this.message = data.message;
      this.title = data.title;
    },
    setShowToast(status) {
      if (status) {
        Swal.fire({
          icon: status,
          title: this.title,
          text: this.message,
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          position: 'top-end',
        });
      }
    },
    setShowModal(status) {
      Swal.fire({
        icon: status,
        title: this.title,
        text: this.message,
      });
    },
  },
});

export default useMessageStore;
