<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable max-len -->
<template>
  <div
    class="offcanvas offcanvas-end"
    style="width: 80% !important; background-color: #dee0d8"
    data-bs-backdrop="static"
    tabindex="-1"
    ref="demoOffcans"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="staticBackdropLabel">
        {{ tempData.name }}
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body overflow-x-auto">
      <nav aria-label="...">
        <ul class="pagination">
          <li class="page-item disabled">
            <a class="page-link">Previous</a>
          </li>
          <li class="page-item active">
            <a class="page-link" href="#">2024/9</a>
          </li>
          <li class="page-item"><a class="page-link" href="#">2024/10</a></li>
          <li class="page-item"><a class="page-link" href="#">2024/11</a></li>
          <li class="page-item"><a class="page-link" href="#">2024/12</a></li>
          <li class="page-item">
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
      <div class="card border-2 border-dark rounded-4 p-2 mb-3">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <template v-for="(item, index) in dateList" :key="index">
                <th scope="col">{{ item }}</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, index) in tempData.timeEntries"
              :key="index"
            >
              <tr>
                <th scope="row text-nowrap">{{ index + 1 }} {{ item.employee.name }}</th>
                <template v-for="(data, key) in dateList" :key="key">
                  <td>
                    <input
                      type="time"
                      id="appt"
                      name="appt"
                      min="00:00"
                      max="20:00"
                      required
                    />
                    ~
                    <input
                      type="time"
                      id="appt"
                      name="appt"
                      min="00:00"
                      max="20:00"
                      required
                    />
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="card border-2 border-dark rounded-4 p-2">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <template v-for="(item, index) in dateList" :key="index">
                <th scope="col">{{ item }}</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, index) in tempData.temporaryWorkers"
              :key="index"
            >
              <tr>
                <th scope="row text-nowrap">{{ index + 1 }} {{ item.name }}</th>
                <template v-for="(data, key) in dateList" :key="key">
                  <td>
                    <input
                      type="time"
                      id="appt"
                      name="appt"
                      min="00:00"
                      max="20:00"
                      required
                    />
                    ~
                    <input
                      type="time"
                      id="appt"
                      name="appt"
                      min="00:00"
                      max="20:00"
                      required
                    />
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Offcanvas } from 'bootstrap';
import { apiGetOrder } from '@/assets/javascript/api';

export default {
  data() {
    return {
      modal: '',
      tempData: {},
      startDate: '',
      dateList: [],
    };
  },
  methods: {
    showModal() {
      this.modal.show();
    },
    getOrder(id) {
      apiGetOrder(id)
        .then((res) => {
          console.log(res.data);
          this.tempData = res.data;
          this.showModal();
          this.dateList = [];
          this.dateList = Array.from({ length: 7 }, (v, i) => i).map(
            (day) => {
              const date = new Date(this.tempData.startDate);
              date.setDate(date.getDate() + day);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            },
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.modal = new Offcanvas(this.$refs.demoOffcans);
    this.$emitter.on('openCall', (e) => {
      this.getOrder(e);
    });
  },
};
</script>
