<template>
  <section style="background-color: #dee0d8">
    <section class="container py-4">
      <div class="row text-center">
        <div class="col-2">
          <div class="card border-2 border-dark rounded-4 h-100">
            <Navbar />
          </div>
        </div>
        <div class="col-10">
          <div
            class="card rounded-4 p-4 bg-body border border-2 border-dark"
            :style="{ height: height + 'px' }"
          >
            <router-view />
          </div>
        </div>
      </div>
    </section>
    <Message />
    <Loading />
  </section>
  <EmployeesModal />
  <VendorModal />
  <InforModal />
  <CaseModal />
  <!-- <OrderModal /> -->
  <Demooffcans />
</template>

<style lang="scss">
@import '@/assets/stylesheets/all';
</style>

<script>
import Navbar from '@/components/layout/NavbarModel.vue';
import EmployeesModal from '@/components/employees/AddEditEmployees.vue';
import VendorModal from '@/components/vendors/AddEditVendor.vue';
// import OrderModal from '@/components/orders/NewTestEdit.vue';
import Message from '@/components/layout/MessageModal.vue';
import Loading from '@/components/layout/LoadingModal.vue';
import Demooffcans from '@/components/demo/OffcansModal.vue';
import CaseModal from '@/components/cases/AddEditCase.vue';

export default {
  data() {
    return {
      height: '',
    };
  },
  components: {
    Navbar,
    EmployeesModal,
    VendorModal,
    CaseModal,
    // OrderModal,
    Message,
    Loading,
    Demooffcans,
  },
  mounted() {
    this.height = window.innerHeight - 48;
  },
};
</script>
