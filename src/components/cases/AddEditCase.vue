<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div
    class="modal fade"
    data-bs-backdrop="static"
    tabindex="-1"
    ref="caseModal"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isNew ? '新增案件' : '編輯案件' }}
          </h5>
          <button type="button" class="btn-close" @click="hideModal"></button>
        </div>

        <VForm v-slot="{ meta }" @submit="submitCase">
          <div class="modal-body">
            <!-- 案件名稱 -->
            <div class="form-floating mb-3">
              <VField
                name="案件名稱"
                rules="required"
                class="form-control"
                v-model="tempCase.name"
              />
              <label>案件名稱</label>
            </div>

            <!-- 合作廠商 -->
            <div class="mb-3">
              <label class="form-label">合作廠商</label>
              <select class="form-select" v-model="tempCase.vendorId" required>
                <option value="">請選擇廠商</option>
                <option
                  v-for="vendor in vendorList"
                  :key="vendor._id"
                  :value="vendor._id"
                >
                  {{ vendor.name }}
                </option>
              </select>
            </div>

            <!-- 施工地址 -->
            <div class="form-floating mb-3">
              <VField
                name="施工地址"
                rules="required"
                class="form-control"
                v-model="tempCase.address"
              />
              <label>施工地址</label>
            </div>

            <!-- 金額 -->
            <div class="form-floating mb-3">
              <VField
                name="案件金額"
                type="number"
                rules="required|min_value:0"
                class="form-control"
                v-model="tempCase.budget"
              />
              <label>案件金額</label>
            </div>

            <!-- 日期 -->
            <div class="row">
              <div class="col">
                <label class="form-label">開工日</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="tempCase.startDate"
                  required
                />
              </div>
              <div class="col">
                <label class="form-label">完工日</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="tempCase.endDate"
                />
              </div>
            </div>

            <!-- 狀態 -->
            <div class="mt-3">
              <label class="form-label">案件狀態</label>
              <select class="form-select" v-model="tempCase.status">
                <option value="planning">規劃中</option>
                <option value="in_progress">施工中</option>
                <option value="completed">已完工</option>
                <option value="paused">暫停</option>
              </select>
            </div>

            <!-- 備註 -->
            <div class="form-floating mt-3">
              <textarea
                class="form-control"
                style="height: 80px"
                v-model="tempCase.description"
              ></textarea>
              <label>備註</label>
            </div>
          </div>

          <div class="modal-footer justify-content-between">
            <button
              type="button"
              class="btn btn-outline-danger"
              v-if="!status"
              @click="deleteCase(tempCase._id)"
            >
              刪除案子
            </button>
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="!meta.valid"
            >
              儲存
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import {
  apiGetVendors,
  apiPostCase,
  apiPutCase,
  apiDeleteCase,
} from '@/assets/javascript/api';

export default {
  data() {
    return {
      modal: null,
      isNew: true,
      vendorList: [],
      tempCase: {},
    };
  },

  methods: {
    deleteCase(id) {
      apiDeleteCase(id)
        .then(() => {
          this.$emitter.emit('messageModal', {
            status: true,
            message: '刪除成功',
          });
          this.$emitter.emit('refreshCaseList');
          this.hideModal();
        })
        .catch();
    },
    async loadVendors() {
      const res = await apiGetVendors();
      this.vendorList = res.data;
    },

    async submitCase() {
      this.$emitter.emit('loadingStatus', true);
      try {
        // eslint-disable-next-line no-underscore-dangle
        if (this.tempCase._id) {
          // eslint-disable-next-line no-underscore-dangle
          await apiPutCase(this.tempCase._id, this.tempCase);
        } else {
          await apiPostCase(this.tempCase);
        }

        this.$emitter.emit('messageModal', {
          status: true,
          message: '儲存成功',
        });
        this.$emitter.emit('refreshCaseList');
        this.hideModal();
      } catch (err) {
        this.$emitter.emit('messageModal', {
          status: false,
          message: err.response?.data?.error || '儲存失敗',
        });
      } finally {
        this.$emitter.emit('loadingStatus', false);
      }
    },

    showModal() {
      this.loadVendors();
      this.modal.show();
    },

    hideModal() {
      this.tempCase = {};
      this.modal.hide();
    },
  },

  mounted() {
    this.modal = new Modal(this.$refs.caseModal);

    this.$emitter.on('addEditCase', ({ isNew, data }) => {
      this.isNew = isNew;
      // eslint-disable-next-line no-underscore-dangle
      this.tempCase = isNew ? {} : { ...data, vendorId: data.vendor._id };
      this.showModal();
    });
  },
};
</script>
