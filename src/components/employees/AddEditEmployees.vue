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
    ref="addEditWorker"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            <span v-if="status">新增員工</span><span v-else>修改員工</span>
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
          v-slot="{ errors, meta }"
          @submit="addEditWorker"
        >
          <div class="modal-body">
            <!-- name -->
            <div class="form-floating mb-3">
              <VField
                name="姓名"
                type="text"
                rules="required"
                class="form-control"
                v-model="tempData.name"
              />
              <label for="floatingInput"
                >員工姓名
                <ErrorMessage name="姓名" class="text-danger ms-3" />
              </label>
            </div>
            <!-- phone -->
            <div class="form-floating mb-3">
              <VField
                id="phone"
                name="phone"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['phone'] }"
                :rules="isPhone"
                v-model="tempData.phone"
              />
              <label for="phone"
                >phone<error-message
                  name="phone"
                  class="text-danger ms-3"
                ></error-message
              ></label>
            </div>
            <!-- identificationNumber -->
            <!-- <div class="form-floating mb-3">
              <VField
                name="身分證字號或居留證"
                class="form-control"
                type="text"
                :rules="{ regex: /^[A-Za-z]{1}[A-Za-z1-2]{1}[0-9]{8}$/ }"
                v-model="tempData._identificationNumber"
              />
              <label for="floatingInput"
                >身分證字號或居留證
                <ErrorMessage
                  name="身分證字號或居留證"
                  class="ms-3 text-danger"
                />
              </label>
            </div> -->
            <!-- photoUrl -->
            <!-- <div class="input-group mb-3">
              <input
                class="form-control"
                type="file"
                accept="image/*"
                id="imageFront"
                name="image"
                multiple="multiple"
                @change="uploadImage"
              />
              <label for="imageFront" class="input-group-text"
                >上傳身分證或居留證</label
              >
            </div>
            <div v-show="tempData.photoUrl" class="mb-3">
              <img :src="tempData.photoUrl" alt="" style="widht:200px">
            </div> -->
            <!-- <div class="input-group mb-3">
              <input
                type="file"
                class="form-control"
                accept="image/*"
                id="imageBack"
                name="image"
              />
              <label for="imageBack" class="input-group-text"
                >上傳身分證或居留證反面</label
              >
            </div> -->
            <!-- role -->
            <!-- <div class="input-group mb-3">
              <label class="input-group-text" for="inputGroupSelect01"
                >員工職別</label
              >
              <select
                class="form-select"
                id="inputGroupSelect01"
                v-model="tempData.role"
              >
                <option value="工人" selected>工人</option>
                <option value="監工">監工</option>
                <option value="工地主任">工地主任</option>
                <option value="工頭">工頭</option>
              </select>
            </div> -->
            <!-- monthlySalary -->
            <!-- <div class="input-group mb-3">
              <label for="date" class="input-group-text">入職日期</label>
              <input
                id="date"
                name="date"
                type="date"
                placeholder="Enter email"
                class="form-control"
                v-model="tempData.entryDate"
              />
            </div> -->
            <!-- hourlyRate -->
            <div class="form-floating mb-3">
              <VField
                name="時薪"
                type="text"
                v-model="tempData.hourlyRate"
                :rules="validateHourlyRate"
                class="form-control"
              />
              <!-- <VField
                name="時薪"
                type="text"
                v-model="tempData.hourlyRate"
                :rules="{
                  regex:
                    /^(([^0][0-9]+|0)\.([0-9])$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9])$)|^(([1-9]+)$)/,
                }"
                class="form-control"
              /> -->
              <label for="floatingInput"
                >時薪
                <ErrorMessage name="時薪" class="text-danger ms-3" />
              </label>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button
              type="button"
              class="btn btn-outline-danger"
              v-if="!status"
              @click="deleteEmployees(tempData._id)"
            >
              刪除員工資料
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
import { Modal } from 'bootstrap';
import {
  apiPatchEmployee,
  apiPostEmployee,
  apiDeleteEmployee,
} from '@/assets/javascript/api';
// import { defineRule } from 'vee-validate';
// import { decimal } from '@vee-validate/rules';

// defineRule('decimal', decimal);

export default {
  data() {
    return {
      modal: '',
      status: false,
      tempData: {
        name: '',
        phone: '',
        photoUrl: '',
        seniority: '',
        hourlyRate: 0,
        entryDate: '',
        monthlySalary: 10,
        role: '工人',
        identificationNumber: '',
      },
    };
  },
  methods: {
    onHourlyRateInput(e) {
      let { value } = e.target;

      // 只允許數字與小數點
      value = value.replace(/[^\d.]/g, '');

      // 只允許一個小數點
      const parts = value.split('.');
      if (parts.length > 2) {
        value = `${parts[0]}.${parts[1]}`;
      }

      // 若超過 2000，直接卡住
      const num = Number(value);
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(num) && num > 2000) {
        value = '2000';
      }

      this.tempData.hourlyRate = value;
    },

    validateHourlyRate(value) {
      if (!value) return '請輸入時薪';

      const num = Number(value);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(num)) return '請輸入數字';
      if (num < 100) return '時薪不能低於 100';
      if (num > 2000) return '時薪不能超過 2000';

      // 最多兩位小數
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        return '最多只能到小數點後兩位';
      }

      return true;
    },
    isPhone(value) {
      // 沒填 → 直接通過（非必填）
      if (!value) return true;

      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    },

    addEditWorker() {
      if (this.tempData.hourlyRate !== undefined) {
        const num = Number(this.tempData.hourlyRate);

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(num)) {
          this.$emitter.emit('messageModal', {
            status: false,
            message: '時薪必須是數字',
          });
          return;
        }
        console.log(this.tempData);

        // 四捨五入兩位後，保持為 number
        this.tempData.hourlyRate = Math.round(num * 100) / 100;
        console.log(this.tempData);
      }
      this.$emitter.emit('loadingStatus', true);
      // eslint-disable-next-line no-underscore-dangle
      if (this.tempData._id) {
        // eslint-disable-next-line no-underscore-dangle
        apiPatchEmployee(this.tempData._id, this.tempData)
          .then(() => {
            // alert成功訊息
            this.$emitter.emit('messageModal', {
              status: true,
              message: '修改成功',
            });
            // 重新取得資料
            this.$emitter.emit('getEmployeesLsit');
            // 結束loading效果
            this.$emitter.emit('loadingStatus', false);
            // 關閉modal
            this.hideModal();
          })
          .catch((err) => {
            console.log(err);
            this.$emitter.emit('messageModal', {
              status: false,
              message: `修改失敗，原因：${JSON.stringify(
                err.response.data.errors,
              )}`,
            });
            this.$emitter.emit('loadingStatus', false);
          });
      } else {
        apiPostEmployee(this.tempData)
          .then(() => {
            this.$emitter.emit('messageModal', {
              status: true,
              message: '新增成功',
            });
            this.$emitter.emit('getEmployeesLsit');
            this.hideModal();
          })
          .catch((err) => {
            console.log(err);
            this.$emitter.emit('messageModal', {
              status: false,
              message: `新增失敗，原因：${JSON.stringify(
                err.response.data.errors,
              )}`,
            });
            this.$emitter.emit('loadingStatus', false);
          });
      }
    },
    deleteEmployees(id) {
      apiDeleteEmployee(id)
        .then(() => {
          this.$emitter.emit('messageModal', {
            status: true,
            message: '刪除成功',
          });
          this.$emitter.emit('getEmployeesLsit');
          this.hideModal();
        })
        .catch();
    },
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.tempData = {
        name: '',
        phone: '',
        photoUrl: '',
        seniority: '',
        hourlyRate: '',
        entryDate: '',
        monthlySalary: '',
        role: '工人',
        identificationNumber: '',
      };
      this.modal.hide();
    },

  },
  mounted() {
    this.modal = new Modal(this.$refs.addEditWorker);
    this.$emitter.on('addEditWorker', (e) => {
      this.status = e.status;
      if (!e.status) {
        this.tempData = JSON.parse(JSON.stringify(e.data));
      }
      this.showModal();
    });
  },
};
</script>
