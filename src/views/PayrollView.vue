<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <section class="mb-3">
    <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
      <h5 class="mb-0">薪資試算</h5>

      <div class="d-flex align-items-center gap-2">
        <input
          type="month"
          class="form-control form-control-sm"
          style="width: 140px"
          v-model="selectedMonth"
          @change="loadPayroll"
        />

        <button
          class="btn btn-sm btn-danger"
          :disabled="payrollList.length === 0 || isGenerating"
          @click="confirmGenerate"
        >
          確認發薪
        </button>
      </div>
    </div>
  </section>

  <section class="overflow-y-auto">
    <table class="table table-hover align-middle">
      <thead class="table-primary sticky-top">
        <tr>
          <th>#</th>
          <th>員工</th>
          <th>時薪</th>
          <th>總工時</th>
          <th>試算薪資</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(item, index) in payrollList"
          :key="item.employeeId"
          @click="selectEmployee(item)"
          style="cursor:pointer"
        >
          <td>{{ index + 1 }}</td>
          <td class="fw-bold">{{ item.name }}</td>
          <td>${{ item.hourlyRate }}</td>
          <td>{{ item.totalHours }} 小時</td>
          <td class="fw-bold text-success">
            ${{ item.totalSalary.toLocaleString() }}
          </td>
          <td>
            <i class="bi bi-chevron-right"></i>
          </td>
        </tr>

        <tr v-if="payrollList.length === 0">
          <td colspan="6" class="text-center text-muted py-4">
            此月份尚無工時紀錄
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- 員工薪資明細 -->
  <div v-if="selectedEmployee" class="mt-4 border-top pt-3">
    <h6>
      {{ selectedEmployee.name }}｜
      {{ selectedMonth }} 薪資明細
    </h6>

    <ul class="list-group">
      <li class="list-group-item">
        時薪：${{ selectedEmployee.hourlyRate }}
      </li>
      <li class="list-group-item">
        總工時：{{ selectedEmployee.totalHours }} 小時
      </li>
      <li class="list-group-item fw-bold">
        試算薪資：${{ selectedEmployee.totalSalary.toLocaleString() }}
      </li>
    </ul>
  </div>
</template>

<script>
import {
  apiGetAllPayroll,
  apiGetPayroll,
  apiPostPayroll,
} from '@/assets/javascript/api';

export default {
  name: 'PayrollView',

  data() {
    return {
      selectedMonth: new Date().toISOString().slice(0, 7),
      payrollList: [],
      selectedEmployee: null,
      isGenerating: false,
    };
  },

  methods: {
    async loadPayroll() {
      this.selectedEmployee = null;

      const [year, month] = this.selectedMonth.split('-');

      this.$emitter.emit('loadingStatus', true);
      try {
        const res = await apiGetAllPayroll({
          year,
          month,
        });
        this.payrollList = res.data.payrollList || [];
      } catch (err) {
        console.error(err);
      } finally {
        this.$emitter.emit('loadingStatus', false);
      }
    },

    async selectEmployee(item) {
      const [year, month] = this.selectedMonth.split('-');

      try {
        const res = await apiGetPayroll(item.employeeId, {
          year,
          month,
        });
        this.selectedEmployee = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    async confirmGenerate() {
      if (
        // eslint-disable-next-line no-restricted-globals
        !confirm(
          `確定要產生 ${this.selectedMonth} 的薪資紀錄嗎？\n此動作不可回復！`,
        )
      ) return;

      const [year, month] = this.selectedMonth.split('-');
      this.isGenerating = true;

      try {
        await apiPostPayroll({ year, month });

        this.$emitter.emit('messageModal', {
          status: true,
          message: '薪資紀錄已成功產生',
        });
      } catch (err) {
        this.$emitter.emit('messageModal', {
          status: false,
          message: err.response?.data?.error || '產生失敗',
        });
      } finally {
        this.isGenerating = false;
      }
    },
  },

  mounted() {
    this.loadPayroll();
  },
};
</script>
