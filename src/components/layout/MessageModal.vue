<template>
  <div
    class="modal fade"
    ref="message"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    style="z-index:99999"
  >
    <div class="modal-dialog">
      <div
        class="alert border-2 rounded-0"
        :class="[status ? 'alert-dark border-dark' : 'alert-danger border-danger']"
      >
        <i
          class="bi me-2"
          :class="[status ? 'bi-check-square' : 'bi-exclamation-triangle']"
        ></i
        >{{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  data() {
    return {
      messageModal: '',
      message: '',
      status: false,
    };
  },
  methods: {
    openModal() {
      this.messageModal.toggle();
    },
  },
  mounted() {
    this.messageModal = new Modal(this.$refs.message);
    this.$emitter.on('messageModal', (e) => {
      this.status = e.status;
      this.message = e.message;
      this.openModal();
    });
  },
};
</script>
