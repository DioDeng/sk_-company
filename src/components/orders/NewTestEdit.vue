<!-- eslint-disable max-len -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="addEditOrder"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            <span v-if="status">新增工單</span><span v-else>修改工單</span>
          </h1>
          <button
            type="button"
            class="btn-close"
            @click="hideModal"
            aria-label="Close"
          ></button>
        </div>
        <VForm
          ref="formRefSignin"
          id="profileForm"
          v-slot="{ meta }"
          @submit="addEditOrder"
        >
          <div class="modal-body">
            <section>
              <!-- name -->
              <div class="form-floating mb-3">
                <VField
                  name="案子簡稱"
                  type="text"
                  rules="required"
                  class="form-control"
                  v-model="tempData.name"
                />
                <label for="floatingInput"
                  >案子簡稱
                  <ErrorMessage name="案子簡稱" class="text-danger ms-3" />
                </label>
              </div>
              <!-- 廠商 -->
              <div class="form-floating mb-3">
                <VField
                  name="廠商"
                  type="text"
                  :rules="isCompanyExist"
                  class="form-control"
                  list="datalistOptions"
                  v-model="tempData.companyName"
                />
                <datalist id="datalistOptions">
                  <template v-for="(item, index) in vendorList" :key="index">
                    <option :value="item.name">{{ item.name }}</option>
                  </template>
                </datalist>
                <label for="floatingInput"
                  >廠商名稱<ErrorMessage name="廠商" class="text-danger ms-3"
                /></label>
              </div>
              <!-- 施工地址 -->
              <div class="form-floating mb-3">
                <VField
                  name="施工地址"
                  rules="required"
                  type="text"
                  v-model="tempData.constructionAddress"
                  class="form-control"
                />
                <label for="floatingInput"
                  >施工地址<ErrorMessage
                    name="施工地址"
                    class="text-danger ms-3"
                /></label>
              </div>
              <!-- 施工日期 -->
              <div class="form-floating mb-3">
                <VField
                  name="施工日期"
                  rules="required"
                  type="date"
                  v-model="tempData.startDate"
                  class="form-control"
                />
                <label for="floatingInput"
                  >施工日期<ErrorMessage
                    name="施工日期"
                    class="text-danger ms-3"
                /></label>
              </div>
              <!-- 總金額 -->
              <div class="form-floating mb-3">
                <VField
                  name="總金額"
                  type="number"
                  rules="required|min_value:0"
                  v-model="tempData.totalAmount"
                  class="form-control"
                />
                <label for="floatingInput"
                  >總金額<ErrorMessage name="總金額" class="text-danger ms-3"
                /></label>
              </div>
              <!-- 保留款 -->
              <div class="form-floating mb-3">
                <VField
                  name="保留款"
                  type="number"
                  rules="required|min_value:0"
                  v-model="tempData.retentionFee"
                  class="form-control"
                />
                <label for="floatingInput"
                  >保留款<ErrorMessage name="保留款" class="text-danger ms-3"
                /></label>
              </div>
              <!-- 工人 -->
              <div class="form-floating mb-3">
                <h5>工人：</h5>
                <div class="input-group mb-2">
                  <template v-for="(item, index) in employList" :key="index">
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :id="`checkboxWorders${index}`"
                        :value="item.id"
                        v-model="tempTimeEntries"
                      />
                      <label
                        class="form-check-label"
                        :for="`checkboxWorders${index}`"
                        >{{ item.name }}</label
                      >
                    </div>
                  </template>
                </div>
              </div>
              <!-- 臨時工 -->
              <div>
                <h5>臨時工：</h5>
                <template
                  v-for="(item, index) in tempData.temporaryWorkers"
                  :key="index"
                >
                  <div class="input-group mb-2">
                    <input
                      type="text"
                      placeholder="工人姓名"
                      class="form-control"
                      v-model="tempData.temporaryWorkers[index].name"
                    />
                    <input
                      type="text"
                      aria-label="Last name"
                      placeholder="工人電話"
                      class="form-control"
                      v-model="tempData.temporaryWorkers[index].phone"
                    />
                    <input
                      type="number"
                      aria-label="Last name"
                      placeholder="時薪"
                      class="form-control"
                      v-model="tempData.temporaryWorkers[index].hourlyRate"
                    />
                    <button
                      class="btn btn-outline-danger"
                      type="button"
                      id="button-add"
                      @click="deleteTransArray(index)"
                    >
                      刪除
                    </button>
                  </div>
                </template>
                <div class="d-flex justify-content-center">
                  <button
                    class="btn btn-outline-dark"
                    type="button"
                    @click="addTransArray"
                  >
                    新增
                  </button>
                </div>
              </div>
            </section>
          </div>
          <div class="modal-footer justify-content-between">
            <button
              type="button"
              class="btn btn-outline-danger"
              v-if="!status"
              @click="deleteOrder(tempData.id)"
            >
              刪除該工單
            </button>
            <div></div>
            <button
              type="submit"
              class="btn btn-primary"
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
// import moment from 'moment';
import { Modal } from 'bootstrap';
import {
  apiPostOrder,
  apiPatchOrder,
  apiUploadPhoto,
  apiGetVendors,
  apiGetEmployees,
  apiDeleteOrder,
} from '@/assets/javascript/api';

export default {
  data() {
    return {
      vendorList: [],
      employList: [],
      modal: '',
      status: false,
      tempData: {
        remainingPayment: 0,
        timeEntries: [],
        temporaryWorkers: [],
      },
      tempTimeEntries: [],
    };
  },
  watch: {
    tempTimeEntries() {
      this.tempData.timeEntries = [];
      this.tempTimeEntries.forEach((item) => {
        this.tempData.timeEntries.push({
          employeeId: item,
          workDays: [
            {
              date: this.tempData.startDate,
              shifts: [{ startTime: '08:00:00', endTime: '17:00:00' }],
            },
          ],
        });
      });
    },
  },
  methods: {
    isCompanyExist(value) {
      this.tempData.company = '';
      let companyId = '';
      // eslint-disable-next-line consistent-return
      this.vendorList.forEach((item) => {
        if (item.name === value) {
          companyId = item.company;
          this.tempData.vendorId = item.id;
        }
      });
      return companyId !== '' ? true : '查無此廠商';
    },
    addEditOrder() {
      this.$emitter.emit('loadingStatus', true);
      if (this.tempData.id) {
        console.log('修改');
        apiPatchOrder(this.tempData, this.tempData.id)
          .then(() => {
            // alert成功訊息
            this.$emitter.emit('messageModal', {
              status: true,
              message: '修改成功',
            });
            // 重新取得資料
            this.$emitter.emit('getOrderLsit');
            // 結束loading效果
            this.$emitter.emit('loadingStatus', false);
            // 關閉modal
            this.hideModal();
          })
          .catch((err) => {
            console.log(err);
            this.$emitter.emit('loadingStatus', false);
          });
      } else {
        console.log('新增');
        apiPostOrder(this.tempData)
          .then((res) => {
            console.log(res);
            this.$emitter.emit('messageModal', {
              status: true,
              message: '新增成功',
            });
            this.$emitter.emit('getOrderLsit');
            this.hideModal();
          })
          .catch((err) => {
            console.log(err);
            this.$emitter.emit('messageModal', {
              status: false,
              message: `新增失敗，原因：${JSON.stringify(err.response)}`,
            });
            this.$emitter.emit('loadingStatus', false);
          });
      }
    },
    deleteOrder(id) {
      this.$emitter.emit('loadingStatus', true);
      apiDeleteOrder(id)
        .then(() => {
          this.$emitter.emit('messageModal', {
            status: true,
            message: '刪除成功',
          });
          this.$emitter.emit('loadingStatus', false);
          this.$emitter.emit('getOrderLsit');
          this.hideModal();
        })
        .catch((err) => {
          this.$emitter.emit('loadingStatus', false);
          this.hideModal();
          console.log(err);
        });
    },
    uploadImage(e) {
      this.$emitter.emit('loadingStatus', true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      apiUploadPhoto(formData)
        .then((res) => {
          this.tempData.constructionImageUrl = res.data.imageUrl;
          this.$emitter.emit('loadingStatus', false);
        })
        .catch((err) => {
          this.$emitter.emit('loadingStatus', false);
          console.log(err);
        });
    },
    getVendors() {
      apiGetVendors()
        .then((res) => {
          this.vendorList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getEmployees() {
      apiGetEmployees()
        .then((res) => {
          this.employList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addTransArray() {
      this.tempData.temporaryWorkers.push({
        workDays: [
          {
            date: this.tempData.startDate,
            shifts: [{ startTime: '05:00:00', endTime: '17:00:00' }],
          },
        ],
      });
    },
    deleteTransArray(index) {
      this.tempData.temporaryWorkers.splice(index, 1);
    },
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.tempData = {
        timeEntries: [],
        remainingPayment: 0,
        temporaryWorkers: [],
      };
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.addEditOrder);
    this.getVendors();
    this.getEmployees();
    this.$emitter.on('addEditOrder', (e) => {
      this.status = e.status;
      if (!e.status) {
        this.tempData = JSON.parse(JSON.stringify(e.data));
        this.tempTimeEntries = [];
        this.tempData.timeEntries.forEach((item) => {
          this.tempTimeEntries.push(item.employeeId);
        });
        this.vendorList.forEach((item) => {
          if (item.id === this.tempData.vendorId) {
            this.tempData.companyName = item.name;
          }
        });
      }
      this.showModal();
    });
  },
};
</script>
