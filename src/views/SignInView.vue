<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <section
    class="container d-flex align-items-center justify-content-center"
    style="height: 100vh"
  >
    <VForm ref="formRefSignin" v-slot="{ meta }" @submit="signIn">
      <div class="form-floating mb-3">
        <VField
          name="username"
          type="text"
          rules="required"
          class="form-control"
        />
        <label for="floatingInput"
          >account<ErrorMessage name="username" class="text-danger ms-3"
        /></label>
      </div>
      <div class="form-floating mb-3">
        <VField
          name="password"
          class="form-control"
          type="password"
          rules="required"
        />
        <label for="floatingInput"
          >Password<ErrorMessage name="password" class="ms-3 text-danger"
        /></label>
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        :class="{ 'btn-dark': !meta.valid }"
        :disabled="!meta.valid"
      >
        登入
      </button>
    </VForm>
  </section>
</template>

<script>
import { apiSignIn } from '@/assets/javascript/api';
import { setToken } from '@/assets/javascript/auth';

export default {
  data() {
    return {};
  },
  methods: {
    signIn(data) {
      this.$emitter.emit('loadingStatus', true);
      apiSignIn(data)
        .then((res) => {
          this.$emitter.emit('loadingStatus', false);
          setToken(res.data.token);
          // const expries = new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toGMTString();
          // document.cookie = `admin=${res.data.data.token}; expires=${expries}; path=/`;
          this.$emitter.emit('messageModal', {
            status: true,
            message: '登入成功',
          });
          this.$router.push('/order');
        })
        .catch((err) => {
          this.$emitter.emit('loadingStatus', false);
          this.$emitter.emit('messageModal', { status: false, message: err.response.data.error });
        });
    },
  },
  mounted() {},
};
</script>
