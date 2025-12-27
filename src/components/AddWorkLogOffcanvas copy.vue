<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    ref="offcanvasRef"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">新增工單</h5>
      <button type="button" class="btn-close" @click="hide"></button>
    </div>

    <div class="offcanvas-body">
      <form @submit.prevent="submit">
        <!-- 員工 -->
        <div class="mb-3">
          <label class="form-label">員工</label>
          <select
            class="form-select"
            v-model="form.employeeId"
            required
          >
            <option value="">請選擇員工</option>
            <option
              v-for="emp in employeeList"
              :key="emp._id"
              :value="emp._id"
            >
              {{ emp.name }}
            </option>
          </select>
        </div>

        <!-- 日期 -->
        <div class="mb-3">
          <label class="form-label">日期</label>
          <input
            type="date"
            class="form-control"
            v-model="form.date"
            required
          />
        </div>

        <!-- 開始時間 -->
        <div class="mb-3">
          <label class="form-label">開始時間</label>
          <input
            type="time"
            class="form-control"
            v-model="form.startTime"
            required
          />
        </div>

        <!-- 結束時間 -->
        <div class="mb-3">
          <label class="form-label">結束時間</label>
          <input
            type="time"
            class="form-control"
            v-model="form.endTime"
            required
          />
        </div>

        <div class="d-grid">
          <button class="btn btn-primary" type="submit">
            儲存工單
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { Offcanvas } from 'bootstrap';
import {
  apiGetEmployees,
  apiCreateWorkLog,
} from '@/assets/javascript/api';

export default {
  name: 'AddWorkLogOffcanvas',

  data() {
    return {
      offcanvas: null,
      caseId: null,
      employeeList: [],
      form: {
        employeeId: '',
        date: '',
        startTime: '',
        endTime: '',
      },
    };
  },

  methods: {
    async loadEmployees() {
      const res = await apiGetEmployees();
      this.employeeList = res.data;
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

        this.$emitter.emit('refreshWorkLog');
        this.hide();
      } catch (err) {
        this.$emitter.emit('messageModal', {
          status: false,
          message: err.response?.data?.error || '新增失敗',
        });
      }
    },

    show(caseId) {
      this.caseId = caseId;
      this.form = {
        employeeId: '',
        date: '',
        startTime: '',
        endTime: '',
      };
      this.loadEmployees();
      this.offcanvas.show();
    },

    hide() {
      this.offcanvas.hide();
    },
  },

  mounted() {
    this.offcanvas = new Offcanvas(this.$refs.offcanvasRef);

    this.$emitter.on('openAddWorkLog', (caseId) => {
      this.show(caseId);
    });
  },

  beforeUnmount() {
    this.$emitter.off('openAddWorkLog');
  },
};
</script>
