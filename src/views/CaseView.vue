<template>
  <section class="mb-3">
    <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
      <h5 class="mb-0">案件列表</h5>

      <a
        href="#"
        class="text-decoration-none"
        @click.prevent="this.$emitter.emit('addEditCase', { isNew: true })"
      >
        新增案件 <i class="bi bi-plus-lg"></i>
      </a>
    </div>
  </section>

  <section class="overflow-y-auto">
    <table class="table align-middle table-hover">
      <thead class="table-primary sticky-top">
        <tr>
          <th>#</th>
          <th>案件名稱</th>
          <th>合作廠商</th>
          <th>工期</th>
          <th>施工地址</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in caseList" :key="item._id">
          <th>{{ index + 1 }}</th>

          <td>
            <div class="fw-bold">{{ item.name }}</div>
            <small class="text-muted">案件編號：{{ item.code || '-' }}</small>
          </td>

          <td>
            <div>{{ item.vendor?.name }}</div>
            <small class="text-muted">
              {{ item.vendor?.contactPerson }} ｜ {{ item.vendor?.phone }}
            </small>
          </td>

          <td>
            <div>{{ formatDate(item.startDate) }}</div>
            <small class="text-muted">
              ～ {{ item.endDate ? formatDate(item.endDate) : '未定' }}
            </small>
          </td>

          <td>{{ item.address }}</td>

          <td>
            <span :class="['badge', statusClass(item.status)]">
              {{ statusText(item.status) }}
            </span>
          </td>

          <td>
            <button
              class="btn btn-sm btn-outline-primary me-1"
              @click="$emitter.emit('addEditCase', { isNew: false, data: item })"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-sm btn-primary"
              @click="$emitter.emit('openAddWorkLog', item._id)"
            >
              新增工單
            </button>
          </td>
        </tr>

        <tr v-if="caseList.length === 0">
          <td colspan="7" class="text-center text-muted py-4">
            尚未建立任何案件
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <WorkLogOffcanvas />
</template>

<script>
import { apiGetCases } from '@/assets/javascript/api';
import WorkLogOffcanvas from '@/components/AddWorkLogOffcanvas.vue';

export default {
  name: 'CaseView',

  data() {
    return {
      caseList: [],
    };
  },
  components: {
    WorkLogOffcanvas,
  },

  methods: {
    async getCases() {
      this.$emitter.emit('loadingStatus', true);
      try {
        const res = await apiGetCases();
        this.caseList = res.data;
      } catch (err) {
        console.error(err);
        this.$emitter.emit('messageModal', {
          status: false,
          message: '取得案件失敗',
        });
      } finally {
        this.$emitter.emit('loadingStatus', false);
      }
    },

    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString();
    },

    statusText(status) {
      const map = {
        planning: '規劃中',
        in_progress: '施工中',
        paused: '暫停',
        completed: '已完工',
        cancelled: '已取消',
      };
      return map[status] || status;
    },

    statusClass(status) {
      const map = {
        planning: 'bg-secondary',
        in_progress: 'bg-primary',
        paused: 'bg-warning',
        completed: 'bg-success',
        cancelled: 'bg-dark',
      };
      return map[status] || 'bg-secondary';
    },
  },

  mounted() {
    this.getCases();

    this.$emitter.on('refreshCaseList', () => {
      this.getCases();
    });
  },

  beforeUnmount() {
    this.$emitter.off('refreshCaseList');
  },
};
</script>
