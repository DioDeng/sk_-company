<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <section class="mb-3">
    <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
      <h5 class="mb-0">工單總覽（老闆用）</h5>

      <!-- 篩選 + 匯出 -->
      <div class="d-flex align-items-center gap-2">
        <div class="btn-group btn-group-sm">
          <button
            class="btn"
            :class="viewMode === 'today' ? 'btn-primary' : 'btn-outline-primary'"
            @click="viewMode = 'today'"
          >
            今天
          </button>
          <button
            class="btn"
            :class="viewMode === 'week' ? 'btn-primary' : 'btn-outline-primary'"
            @click="viewMode = 'week'"
          >
            本週
          </button>
        </div>

        <!-- 年月 -->
        <input
          type="month"
          class="form-control form-control-sm"
          style="width: 140px"
          v-model="selectedMonth"
          @change="viewMode = 'month'"
        />

        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" @click="exportCSV">
            匯出 CSV
          </button>
          <button class="btn btn-outline-success" @click="exportExcel">
            匯出 Excel
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="overflow-y-auto">
    <table class="table table-hover align-middle">
      <thead class="table-primary sticky-top">
        <tr>
          <th>#</th>
          <th>案件</th>
          <th>日期</th>
          <th>廠商</th>
          <th>人數</th>
          <th>總工時</th>
          <th>總成本</th>
          <th>地址</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(item, index) in groupedLogs" :key="item.id">
          <!-- 主列 -->
          <tr
            :class="rowClass(item)"
            @click="toggle(item.id)"
            style="cursor:pointer"
          >
            <td>{{ index + 1 }}</td>
            <td class="fw-bold">{{ item.caseName }}</td>
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ item.vendorName }}</td>

            <td>
              <span
                class="badge"
                :class="item.workerCount === 0 ? 'bg-danger' : 'bg-primary'"
              >
                {{ item.workerCount }} 人
              </span>
            </td>

            <td>
              <span class="badge bg-secondary">
                {{ item.totalHours }} 小時
              </span>
            </td>

            <td>
              <span class="badge bg-dark">
                ${{ item.totalCost.toLocaleString() }}
              </span>
            </td>

            <td class="text-muted">{{ item.address }}</td>

            <td>
              <i
                class="bi"
                :class="expandedId === item.id ? 'bi-chevron-up' : 'bi-chevron-down'"
              />
            </td>
          </tr>

          <!-- 展開列 -->
          <tr v-if="expandedId === item.id">
            <td colspan="9" class="bg-light">
              <strong>施工人員：</strong>

              <div
                v-for="(worker, i) in item.workersDetail"
                :key="i"
                class="d-inline-block me-2 mb-1"
              >
                <span class="badge bg-light text-dark">
                  {{ worker.name }}
                  （{{ worker.hours }}h / ${{ worker.cost.toLocaleString() }}）
                </span>
              </div>

              <div v-if="item.workerCount === 0" class="text-danger mt-1">
                ⚠️ 無人施工
              </div>
            </td>
          </tr>
        </template>

        <tr v-if="groupedLogs.length === 0">
          <td colspan="9" class="text-center text-muted py-4">
            尚無工單資料
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { apiGetWorkLog } from '@/assets/javascript/api';
import * as XLSX from 'xlsx';

export default {
  name: 'WorkLogView',

  data() {
    return {
      workLogs: [],
      expandedId: null,
      viewMode: 'today', // today | week | month
      selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    };
  },

  computed: {
    /**
     * 老闆專用彙總資料
     * 一天 × 一案件
     * 合併同一員工、計算工時與成本
     */
    groupedLogs() {
      const map = {};

      this.workLogs.forEach((log) => {
        const dateKey = new Date(log.date).toISOString().split('T')[0];
        // eslint-disable-next-line no-underscore-dangle
        const key = `${log.case._id}_${dateKey}`;

        if (!map[key]) {
          map[key] = {
            id: key,
            caseName: log.case.name,
            vendorName: log.case.vendor?.name || '',
            address: log.case.address,
            date: dateKey,
            workers: {},
            totalHours: 0,
            totalCost: 0,
          };
        }

        // eslint-disable-next-line no-underscore-dangle
        const empId = log.employee._id;
        const rate = log.employee.hourlyRate || 0;

        if (!map[key].workers[empId]) {
          map[key].workers[empId] = {
            name: log.employee.name,
            hours: 0,
            cost: 0,
          };
        }

        map[key].workers[empId].hours += log.hours;
        map[key].workers[empId].cost += log.hours * rate;

        map[key].totalHours += log.hours;
        map[key].totalCost += log.hours * rate;
      });

      return Object.values(map)
        .filter((item) => {
          if (this.viewMode === 'today') return this.isToday(item.date);
          if (this.viewMode === 'week') return this.isThisWeek(item.date);
          if (this.viewMode === 'month') return this.isInMonth(item.date);
          return true;
        })
        .map((item) => {
          const workersArray = Object.values(item.workers);
          return {
            ...item,
            workerCount: workersArray.length,
            workersDetail: workersArray,
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },

  methods: {
    async getWorkLogs() {
      this.$emitter.emit('loadingStatus', true);
      try {
        const res = await apiGetWorkLog();
        this.workLogs = res.data;
      } finally {
        this.$emitter.emit('loadingStatus', false);
      }
    },

    toggle(id) {
      this.expandedId = this.expandedId === id ? null : id;
    },

    rowClass(item) {
      if (item.workerCount === 0) return 'table-danger';
      if (item.totalHours >= 12) return 'table-warning';
      return '';
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    isToday(dateStr) {
      const d = new Date(dateStr);
      const t = new Date();
      return d.toDateString() === t.toDateString();
    },

    isThisWeek(dateStr) {
      const d = new Date(dateStr);
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return d >= start && d < end;
    },

    isInMonth(dateStr) {
      const d = new Date(dateStr);
      const [y, m] = this.selectedMonth.split('-').map(Number);
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    },

    exportCSV() {
      const headers = [
        '案件',
        '日期',
        '廠商',
        '人數',
        '總工時',
        '總成本',
        '施工人員明細',
      ];

      const rows = this.groupedLogs.map((item) => {
        const workers = item.workersDetail
          .map((w) => `${w.name}(${w.hours}h/$${w.cost})`)
          .join('、');

        return [
          item.caseName,
          this.formatDate(item.date),
          item.vendorName,
          item.workerCount,
          item.totalHours,
          item.totalCost,
          workers,
        ];
      });

      const csv = [headers, ...rows]
        .map((r) => r.map((v) => `"${v}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `worklogs_${this.viewMode}.csv`;
      link.click();
    },

    exportExcel() {
      const data = this.groupedLogs.map((item) => ({
        案件: item.caseName,
        日期: this.formatDate(item.date),
        廠商: item.vendorName,
        人數: item.workerCount,
        總工時: item.totalHours,
        總成本: item.totalCost,
        施工人員: item.workersDetail
          .map((w) => `${w.name}(${w.hours}h/$${w.cost})`)
          .join('、'),
      }));

      const sheet = XLSX.utils.json_to_sheet(data);
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, '工單總覽');
      XLSX.writeFile(book, `worklogs_${this.viewMode}.xlsx`);
    },
  },

  mounted() {
    this.getWorkLogs();
  },
};
</script>
