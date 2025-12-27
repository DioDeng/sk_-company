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
        class="text-decoration-none btn btn-dark"
        style="
          --bs-btn-padding-y: 0.25rem;
          --bs-btn-padding-x: 0.5rem;
          --bs-btn-font-size: 0.75rem;
        "
        @click.prevent="this.$emitter.emit('addEditVendor', { status: true })"
      >
        新增廠商<i class="bi bi-plus-lg"></i>
      </a>
    </div>
  </section>
  <section class="overflow-y-scroll">
    <table class="table align-middle table-hover">
      <thead class="sticky-top table-primary">
        <tr class="">
          <th scope="col">#</th>
          <th scope="col">公司</th>
          <th scope="col">負責人</th>
          <th scope="col">電話</th>
          <th scope="col">統編</th>
          <th scope="col">地址</th>
          <th scope="col">合作記錄</th>
          <th scope="col">修改</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in vendorList" :key="item.id">
          <tr>
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.contactPerson }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.taxId }}</td>
            <td>{{ item.address }}</td>
            <td>
              <button
                class="btn btn-dark"
                @click="this.$emitter.emit('infoVendor', item.id)"
              >
                <i class="bi bi-journal-text"></i>
              </button>
            </td>
            <td>
              <button
                class="btn btn-success"
                @click="
                  this.$emitter.emit('addEditVendor', {
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
import { apiGetVendors } from '@/assets/javascript/api';

export default {
  data() {
    return {
      stickyHeight: 0,
      vendorList: [],
    };
  },
  methods: {
    getVendors() {
      this.$emitter.emit('loadingStatus', true);
      apiGetVendors()
        .then((res) => {
          this.vendorList = res.data;
          this.$emitter.emit('loadingStatus', false);
        })
        .catch((err) => {
          console.log(err, 'err');
          this.$emitter.emit('loadingStatus', false);
        });
    },
  },
  mounted() {
    this.getVendors();
    this.$emitter.on('getVendorLsit', () => {
      this.getVendors();
    });
  },
  beforeUnmount() {
    this.$emitter.off('getVendorLsit');
  },
};
</script>
