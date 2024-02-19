import { Modal } from 'flowbite';

export default {
  data() {
    return {
      modal: null,
    };
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.flowbiteModal);
  },
};
