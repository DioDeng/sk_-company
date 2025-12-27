import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/CaseView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/case',
    name: 'case',
    component: () => import('../views/CaseView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/WorkLogView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/employees',
    name: 'employees',
    component: () => import('../views/EmployeeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/company',
    name: 'company',
    component: () => import('../views/VendorView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/payroll',
    name: 'payroll',
    component: () => import('../views/PayrollView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/SignInView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/* 🔐 路由守衛（一定放這裡） */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // 未登入卻想進受保護頁
  if (to.meta.requiresAuth && !token) {
    next('/login');
    return;
  }

  // 已登入還想去 login（可選，但很實用）
  if (to.path === '/login' && token) {
    next('/');
    return;
  }

  next();
});

export default router;
