<template>
  <div class="vl-parent">
    <loading :active="status" :can-cancel="true" :is-full-page="fullPage">
      <div class="loader"></div>
    </loading>
  </div>
</template>

<style lang="scss" scoped>
.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  animation-fill-mode: both;
  animation: bblFadInOut 1.8s infinite ease-in-out;
}
.loader {
  color: #000;
  font-size: 7px;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}

@keyframes bblFadInOut {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      status: false,
      fullPage: true,
    };
  },
  components: {
    Loading,
  },
  mounted() {
    this.$emitter.on('loadingStatus', (e) => {
      this.status = e;
    });
  },
};
</script>
