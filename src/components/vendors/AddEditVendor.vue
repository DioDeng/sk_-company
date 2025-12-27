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
    ref="vendorModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            <span v-if="status">新增廠商</span><span v-else>修改廠商</span>
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
                >廠商名稱
                <ErrorMessage name="姓名" class="text-danger ms-3" />
              </label>
            </div>
            <!-- contactPerson -->
            <div class="form-floating mb-3">
              <VField
                name="聯絡人"
                type="text"
                rules="required"
                class="form-control"
                v-model="tempData.contactPerson"
              />
              <label for="floatingInput"
                >聯絡人名稱
                <ErrorMessage name="聯絡人" class="text-danger ms-3" />
              </label>
            </div>
            <!-- phone -->
            <div class="form-floating mb-3">
              <VField
                id="phone"
                name="phone"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['電話'] }"
                v-model="tempData.phone"
              />
              <label for="phone"
                >phone<error-message
                  name="phone"
                  class="text-danger ms-3"
                ></error-message
              ></label>
            </div>
            <!-- address -->
            <div class="form-floating mb-3">
              <VField
                name="地址"
                type="text"
                rules="required"
                class="form-control"
                v-model="tempData.address"
              />
              <label for="floatingInput"
                >廠商地址
                <ErrorMessage name="地址" class="text-danger ms-3" />
              </label>
            </div>
            <!-- taxId -->
            <div class="form-floating mb-3">
              <VField
                name="統編"
                type="text"
                v-model="tempData.taxId"
                :rules="{
                  regex:
                    /^[0-9]{8}$/,
                }"
                class="form-control"
              />
              <label for="floatingInput"
                >統編
                <ErrorMessage name="統編" class="text-danger ms-3" />
              </label>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button
              type="button"
              class="btn btn-outline-danger"
              v-if="!status"
              @click="deleteVendor(tempData._id)"
            >
              刪除廠商資料
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
  apiPatchVendor,
  apiPostVendor,
  apiDeleteVendor,
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
        contactPerson: '',
        taxId: '',
        address: '',
      },
    };
  },
  methods: {
    // isPhone(value) {
    //   const phoneNumber = /^(09)[0-9]{8}$/;
    //   return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    // },
    addEditWorker() {
      this.$emitter.emit('loadingStatus', true);
      console.log(this.tempData);
      // eslint-disable-next-line no-underscore-dangle
      if (this.tempData._id) {
        // eslint-disable-next-line no-underscore-dangle
        apiPatchVendor(this.tempData, this.tempData._id)
          .then(() => {
            // alert成功訊息
            this.$emitter.emit('messageModal', {
              status: true,
              message: '修改成功',
            });
            // 重新取得資料
            this.$emitter.emit('getVendorLsit');
            // 結束loading效果
            this.$emitter.emit('loadingStatus', false);
            // 關閉modal
            this.hideModal();
          })
          .catch(() => {
            this.$emitter.emit('loadingStatus', false);
          });
      } else {
        apiPostVendor(this.tempData)
          .then(() => {
            this.$emitter.emit('messageModal', {
              status: true,
              message: '新增成功',
            });
            this.$emitter.emit('getVendorLsit');
            this.hideModal();
          })
          .catch((err) => {
            this.$emitter.emit('messageModal', {
              status: false,
              message: `新增失敗，原因：${JSON.stringify(
                err.response.data.error,
              )}`,
            });
          })
          .finally(() => {
            this.$emitter.emit('loadingStatus', false);
          });
      }
    },
    deleteVendor(id) {
      apiDeleteVendor(id)
        .then(() => {
          this.$emitter.emit('messageModal', {
            status: true,
            message: '刪除成功',
          });
          this.$emitter.emit('getVendorLsit'); // apiGetVendorLsit
          this.hideModal();
        })
        .catch();
    },
    // async uploadImage() {
    //   const formData = new FormData(document.getElementById('profileForm'));
    //   await this.upload(formData, 'photo');
    //   this.tempProfile.photo = this.tempImage.url;
    //   this.imageMsg = this.tempImage.msg;
    // },
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.tempData = {};
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.vendorModal);
    this.$emitter.on('addEditVendor', (e) => {
      this.status = e.status;
      if (!e.status) {
        this.tempData = JSON.parse(JSON.stringify(e.data));
      }
      this.showModal();
    });
  },
};
</script>
