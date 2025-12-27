<template>
  <section class="container-fluid overflow-y-scroll">
    <div class="row row-cols-1 row-cols-md-4 g-4 mb-4">
      <template v-for="(item, index) in navList" :key="index">
        <div class="col">
          <div class="card h-100 shadow rounded-4">
            <div class="card-body">
              <div class="d-flex justify-content-between mb-3">
                <div>
                  <h5 class="card-title text-start text-black-50">
                    {{ item.title }}
                  </h5>
                  <p class="card-text h1">${{ item.num }}</p>
                </div>
                <div>
                  <i class="bi h2" :class="item.classList"></i>
                </div>
              </div>
              <p class="mb-0">
                <span class="text-success">+55%</span> since yesterday
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="row">
      <div class="col-lg-7 mb-lg">
        <div class="card h-100">
          <GradientLineChart
            id="chart-line"
            title="Sales Overview"
            description="<i class='fa fa-arrow-up text-success'></i>
      <span class='font-weight-bold'>4% more</span> in 2024"
            :chart="{
              labels: [
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              datasets: [
                {
                  label: 'Mobile Apps',
                  data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
                },
              ],
            }"
          />
        </div>
      </div>
      <div class="col-lg-5 mb-lg">
        <div class="card h-100">
          <SwiperModalVue />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import GradientLineChart from '@/components/home/GradientLineChart.vue';
import SwiperModalVue from '@/components/home/SwiperModal.vue';

export default {
  name: 'HomeView',
  data() {
    return {
      navList: [
        {
          title: '本月案件數量',
          num: 0,
          classList: 'text-success bi-1-circle-fill',
        },
        {
          title: '本月案件金額',
          num: 0,
          classList: 'text-warning bi-2-circle-fill',
        },
        {
          title: '員工數量',
          logo: 'bi-3-circle-fill',
          num: 0,
          classList: 'text-secondary bi-3-circle-fill',
        },
        {
          title: '廠商數量',
          num: 0,
          classList: 'text-primary bi-4-circle-fill',
        },
      ],
    };
  },
  components: {
    GradientLineChart,
    SwiperModalVue,
  },
};
</script>
