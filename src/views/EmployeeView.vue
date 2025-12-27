<template>
  <section class="mb-3">
    <div class="d-flex justify-content-between border-bottom">
      <ul class="list-unstyled">
        <li class="nav-item dropdown">
          <!-- <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            篩選
          </a> -->
          <!-- <ul class="dropdown-menu" style="z-index: 99999">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul> -->
        </li>
      </ul>
      <a
        href="#"
        class="text-decoration-none"
        style="
          --bs-btn-padding-y: 0.25rem;
          --bs-btn-padding-x: 0.5rem;
          --bs-btn-font-size: 0.75rem;
        "
        @click.prevent="this.$emitter.emit('addEditWorker', { status: true })"
      >
        新增員工<i class="bi bi-plus-lg"></i>
      </a>
    </div>
  </section>
  <section class="overflow-y-scroll">
    <table class="table align-middle table-hover">
      <thead class="sticky-top table-primary">
        <tr>
          <th scope="col">#</th>
          <!-- <th scope="col" style="width:10%">照片</th> -->
          <th scope="col">姓名</th>
          <th scope="col">電話</th>
          <!-- <th scope="col">身份證</th> -->
          <!-- <th scope="col">入職</th> -->
          <!-- <th scope="col">月薪</th> -->
          <th scope="col">時薪</th>
          <th scope="col">工作記錄</th>
          <th scope="col">修改</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in personnelList" :key="index">
          <tr>
            <th scope="row">{{ index + 1 }}</th>
            <!-- <td><img :src="item.photoUrl" alt=""></td> -->
            <td>{{ item.name }}</td>
            <td>{{ item.phone }}</td>
            <!-- <td>{{ item.identificationNumber }}</td> -->
            <!-- <td>{{ item.entryDate }}</td> -->
            <!-- <td>{{ item.monthlySalary }}</td> -->
            <td>{{ item.hourlyRate }}</td>
            <td>
              <button
                class="btn btn-dark"
                @click="this.$emitter.emit('workerList', item.id)"
              >
                <i class="bi bi-journal-text"></i>
              </button>
            </td>
            <td>
              <button
                class="btn btn-success"
                @click="
                  this.$emitter.emit('addEditWorker', {
                    status: false,
                    data: item,
                  })
                "
              >
                <i class="bi bi-pencil"></i>
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<script>
import { apiGetEmployees } from '@/assets/javascript/api';

export default {
  data() {
    return {
      personnelList: [],
    };
  },
  methods: {
    getEmployees() {
      this.$emitter.emit('loadingStatus', true);
      apiGetEmployees()
        .then((res) => {
          this.personnelList = res.data;
          this.$emitter.emit('loadingStatus', false);
        })
        .catch((err) => {
          console.log(err);
          this.$emitter.emit('loadingStatus', false);
        });
    },
  },
  mounted() {
    this.getEmployees();
    this.$emitter.on('getEmployeesLsit', () => {
      this.getEmployees();
    });
  },
  beforeUnmount() {
    this.$emitter.off('getEmployeesLsit');
  },
};
</script>
