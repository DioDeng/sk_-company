<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" ref="offcanvasRef">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">新增工單</h5>
      <button type="button" class="btn-close" @click="hide"></button>
    </div>

    <div class="offcanvas-body d-flex flex-column">
      <!-- 日期 Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item" v-for="tab in dateTabs" :key="tab.key">
          <button
            class="nav-link"
            :class="{ active: activeTab === tab.key }"
            @click="selectTab(tab)"
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>

      <!-- 自選日期 -->
      <div v-if="activeTab === 'custom'" class="mb-3">
        <input type="date" class="form-control" v-model="form.date" />
      </div>

      <!-- 新增工單表單 -->
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">員工</label>
          <select class="form-select" v-model="form.employeeId" required>
            <option value="">請選擇員工</option>
            <option v-for="emp in employeeList" :key="emp._id" :value="emp._id">
              {{ emp.name }}
            </option>
          </select>
        </div>

        <div class="row g-2 mb-3">
          <div class="col">
            <label class="form-label">開始時間</label>
            <input
              type="time"
              class="form-control"
              step="1800"
              @blur="form.startTime = normalizeTime(form.startTime)"
              v-model="form.startTime"
              required
            />
          </div>
          <div class="col">
            <label class="form-label">結束時間</label>
            <input
              type="time"
              class="form-control"
              step="1800"
              @blur="form.endTime = normalizeTime(form.endTime)"
              v-model="form.endTime"
              required
            />
          </div>
        </div>

        <div class="d-grid mb-3">
          <button class="btn btn-primary" type="submit">儲存工單</button>
        </div>
      </form>

      <!-- 工單列表 -->
      <div class="border-top pt-3 flex-grow-1 overflow-auto">
        <h6 class="mb-3">當日工單</h6>

        <div v-if="workLogList.length === 0" class="text-muted">尚無工單</div>

        <div
          v-for="log in workLogList"
          :key="log._id"
          class="border rounded p-2 mb-2"
        >
          <div class="d-flex justify-content-between align-items-start">
            <strong>{{ log.employee.name }}</strong>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteLog(log)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="text-muted">{{ log.startTime }} - {{ log.endTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Offcanvas } from 'bootstrap';
import {
  apiGetEmployees,
  apiCreateWorkLog,
  apiGetWorkLog,
  apiDeleteWorkLog,
} from '@/assets/javascript/api';

export default {
  name: 'AddWorkLogOffcanvas',

  data() {
    return {
      offcanvas: null,
      caseId: null,
      employeeList: [],
      workLogList: [],
      activeTab: 'today',
      dateTabs: [
        { key: 'today', label: '今天', offset: 0 },
        { key: 'yesterday', label: '昨天', offset: -1 },
        { key: 'tomorrow', label: '明天', offset: 1 },
        { key: 'custom', label: '自選日期' },
      ],
      form: {
        employeeId: '',
        date: '',
        startTime: '',
        endTime: '',
      },
    };
  },

  watch: {
    'form.date': function () {
      this.loadWorkLogs();
    },
  },

  methods: {
    formatDate(offset = 0) {
      const d = new Date();
      d.setDate(d.getDate() + offset);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },

    selectTab(tab) {
      console.log('[selectTab] tab:', tab);
      this.activeTab = tab.key;

      if (tab.offset !== undefined) {
        this.form.date = this.formatDate(tab.offset);
      }
      console.log('[selectTab] after set, form.date =', this.form.date);
      // 🔥 重點：不管有沒有變，都主動刷新
      this.loadWorkLogs();
    },
    async loadEmployees() {
      const res = await apiGetEmployees();
      this.employeeList = res.data;
    },

    async loadWorkLogs() {
      console.log('[loadWorkLogs] caseId:', this.caseId);
      console.log('[loadWorkLogs] date:', this.form.date);

      if (!this.caseId || !this.form.date) return;

      const res = await apiGetWorkLog({
        caseId: this.caseId,
        date: this.form.date,
      });

      console.log('[loadWorkLogs] response:', res.data);

      this.workLogList = res.data;
    },

    async submit() {
      try {
        await apiCreateWorkLog({
          employee: this.form.employeeId,
          caseId: this.caseId,
          date: this.form.date,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
        });

        this.$emitter.emit('messageModal', {
          status: true,
          message: '新增工單成功',
        });

        this.form.startTime = '';
        this.form.endTime = '';
        await this.loadWorkLogs();
      } catch (err) {
        this.$emitter.emit('messageModal', {
          status: false,
          message: err.response?.data?.error || '新增失敗',
        });
      }
    },

    async deleteLog(log) {
      // eslint-disable-next-line no-restricted-globals
      if (!confirm('確定要刪除這筆工單？')) return;
      // eslint-disable-next-line no-underscore-dangle
      await apiDeleteWorkLog(log._id);
      await this.loadWorkLogs();
    },

    show(caseId) {
      this.caseId = caseId;
      this.activeTab = 'today';
      this.form.date = this.formatDate(0);
      this.form.employeeId = '';
      this.form.startTime = '';
      this.form.endTime = '';
      this.loadEmployees();
      this.loadWorkLogs();
      this.offcanvas.show();
    },

    hide() {
      this.offcanvas.hide();
    },
    normalizeTime(time) {
      if (!time) return '';

      const [hour, minute] = time.split(':').map(Number);

      let newHour = hour;
      // eslint-disable-next-line no-nested-ternary
      const newMinute = minute < 15 ? 0 : minute < 45 ? 30 : 0;

      if (minute >= 45) {
        newHour = (hour + 1) % 24;
      }

      return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(
        2,
        '0',
      )}`;
    },
  },

  mounted() {
    this.offcanvas = new Offcanvas(this.$refs.offcanvasRef);
    this.$emitter.on('openAddWorkLog', this.show);
  },

  beforeUnmount() {
    this.$emitter.off('openAddWorkLog', this.show);
  },
};
</script>
