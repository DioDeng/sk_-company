<template>
  <section class="py-4 px-3 d-flex align-items-center flex-column h-100">
    <h5 class="border-bottom w-100 pb-3">工單系統</h5>
      <ul class="list-unstyled py-3 w-100">
      <template v-for="(item, index) in menuList" :key="index">
        <li
          class="p-3 rounded w-100"
          :class="{ checked: this.$route.path.split('/')[1] === item.path.split('/')[1] }"
        >
          <router-link :to="item.path" class="text-decoration-none h5"
            ><i class="bi me-2" :class="item.icon"></i
            >{{ item.title }}</router-link
          >
        </li>
      </template>
    </ul>
    <button class="btn btn-outline-danger mt-auto" @click="logout">
        登出
    </button>
  </section>
</template>

<style lang="scss" scoped>
.checked {
  background: #eeeeee;
}
</style>

<script>
import { removeToken } from '@/assets/javascript/auth';

export default {
  data() {
    return {
      menuList: [
        // {
        //   title: 'Home',
        //   icon: 'bi-laptop text-secondary',
        //   color: 'primary',
        //   path: '/',
        // },
        {
          title: '工單',
          icon: 'bi-list-task text-warning',
          color: 'warning',
          path: '/order',
        },
        {
          title: '案子',
          icon: 'bi-list-task text-dark',
          color: 'dark',
          path: '/case',
        },
        {
          title: '員工',
          icon: 'bi-people text-success',
          color: 'success',
          path: '/employees',
        },
        {
          title: '廠商',
          icon: 'bi-building text-info',
          color: 'info',
          path: '/company',
        },
        {
          title: '薪資',
          icon: 'bi-building text-info',
          color: 'primary',
          path: '/payroll',
        },
        // {
        //   title: 'Demo Order',
        //   icon: 'bi-building text-danger',
        //   color: 'info',
        //   path: '/demo',
        // },
      ],
    };
  },
  computed: {
    isLogin() {
      return !!localStorage.getItem('token');
    },
  },
  methods: {
    logout() {
      // 顯示 loading（如果你有全域 loading）
      this.$emitter.emit('loadingStatus', true);

      // 1️⃣ 清 token
      removeToken();

      // 2️⃣ 關 loading
      this.$emitter.emit('loadingStatus', false);

      // 3️⃣ 顯示訊息
      this.$emitter.emit('messageModal', {
        status: true,
        message: '已登出',
      });

      // 4️⃣ 導回登入頁
      this.$router.push('/login');
    },
  },
};
</script>
