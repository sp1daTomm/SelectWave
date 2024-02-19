import { Collapse } from 'flowbite';

export default {
  data() {
    return {
      collapseModal: null,
    };
  },
  mounted() {
    this.collapseModal = new Collapse(this.$refs.flowbiteCollapse);
  },
};
