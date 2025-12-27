<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div
    class="modal fade"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="workRecordModal"
  >
    <div class="modal-dialog modal-fullscreen-xl-down">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">工程名稱</th>
                <th scope="col">日期</th>
                <th scope="col">時數</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in tempData" :key="index">
                <tr>
                  <th scope="row">{{ index + 1 }}</th>
                  <td>
                    <button class="btn btn-dark" @click="getOrder(item._id)">
                      {{ item._id }}
                    </button>
                  </td>
                  <td>{{ item.constructionDate }}</td>
                  <td>{{ item.time }}</td>
                </tr>
              </template>
              <tr>
                <td colspan="3">總累積時數：</td>
                <td>{{ times }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="tempOrder">
            <form class="row g-3">
              <div class="col-md-6">
                <label for="inputEmail4" class="form-label">廠商名稱</label>
                <input
                  type="text"
                  class="form-control"
                  id="inputEmail4"
                  disabled
                  v-model="tempOrder.company.companyName"
                />
              </div>
              <div class="col-md-6">
                <label for="inputPassword4" class="form-label">負責人</label>
                <input
                  type="text"
                  class="form-control"
                  id="inputPassword4"
                  v-model="tempOrder.company.name"
                  disabled
                />
              </div>
              <div class="col-12">
                <label for="inputAddress" class="form-label">施工地址</label>
                <input
                  type="text"
                  class="form-control"
                  id="inputAddress"
                  v-model="tempOrder.address"
                  disabled
                />
              </div>
              <div class="col-md-6">
                <label for="inputAddress2" class="form-label">工程日期</label>
                <input
                  type="text"
                  class="form-control"
                  id="inputAddress2"
                  disabled
                  v-model="tempOrder.constructionDate"
                />
              </div>
              <div class="col-md-6">
                <button
                  class="btn"
                  :class="[
                    tempOrder.status ? 'btn-outline-success' : 'btn-outline-danger',
                  ]"
                  disabled
                >
                  <span v-if="tempOrder.status">完工</span
                  ><span v-else>未完工</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { apiGetWorkerList, apiGetOrder } from '@/assets/javascript/api';

export default {
  data() {
    return {
      modal: '',
      tempData: '',
      times: 0,
      tempOrder: '',
    };
  },
  methods: {
    getOrder(id) {
      this.$emitter.emit('loadingStatus', true);
      apiGetOrder(id)
        .then((res) => {
          this.$emitter.emit('loadingStatus', false);
          this.tempOrder = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$emitter.emit('loadingStatus', false);
        });
    },
    getWorkerList(id) {
      this.$emitter.emit('loadingStatus', true);
      apiGetWorkerList(id)
        .then((res) => {
          this.tempData = res.data.data;
          this.$emitter.emit('loadingStatus', false);
          this.totalTime();
        })
        .catch((err) => {
          console.log(err);
          this.$emitter.emit('loadingStatus', true);
        });
    },
    totalTime() {
      this.times = 0;
      this.tempData.forEach((item) => {
        this.times += item.time;
      });
    },
    showModal() {
      this.modal.show();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.workRecordModal);
    this.$emitter.on('workerList', (e) => {
      this.tempOrder = '';
      this.getWorkerList(e);
      this.showModal();
    });
  },
  // unmounted() {
  //   this.modal = '';
  // },
};
</script>
