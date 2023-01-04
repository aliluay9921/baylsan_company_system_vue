<template>
  <v-container>
    <div id="root">
      <div class="container pt-5">
        <div class="row align-items-stretch">
          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4
                class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title"
              >
                العاملات التي تم بيعها
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                data.buys_workers
              }}</span>
              <div class="icon">
                <i class="fa fa-user-times" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4
                class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title"
              >
                العاملات المتوفرات
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                data.worker_available
              }}</span>
              <!-- <i class="fas fa-chalkboard-teacher"></i> -->

              <div class="icon">
                <i class="fa fa-users" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4
                class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title"
              >
                مبيعات اليوم
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                data.sales_day
              }}</span>
              <!-- <font-awesome-icon icon="fa-solid fa-screen-users" /> -->
              <div class="icon">
                <i class="fa fa-balance-scale" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row align-items-stretch">
          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4
                class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title"
              >
                صرفيات اليوم
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                data.withdraw_day
              }}</span>
              <div class="icon">
                <i class="fa fa-window-minimize" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4
                class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title"
              >
                صرفيات الشهر
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                data.withdraw_month
              }}</span>
              <!-- <i class="fas fa-chalkboard-teacher"></i> -->

              <div class="icon">
                <i class="fa fa-calendar" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4
                class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title"
              >
                مبيعات الشهر
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                data.sales_month
              }}</span>
              <div class="icon">
                <i class="fa fa-calculator" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      data: {
        worker_available: 0,
        buys_workers: 0,
        sales_day: 0,
        sales_month: 0,
        withdraw_day: 0,
        withdraw_month: 0,
      },
    };
  },
  computed: {
    statistics() {
      return this.$store.state.statistics;
    },
  },
  methods: {
    getStatistics() {
      this.$store.dispatch("getStatistics");
    },
  },
  created() {
    this.getStatistics();
  },

  watch: {
    statistics: function () {
      this.statistics.forEach((element) => {
        this.data["buys_workers"] = element.buys_workers;
        this.data["worker_available"] = element.worker_available;
        this.data["sales_day"] = element.sales_day;
        this.data["sales_month"] = element.sales_month;
        this.data["withdraw_month"] = element.withdraw_month;
        this.data["withdraw_day"] = element.withdraw_day;
      });

      console.log(this.data);
    },
  },
};
</script>
<style>
.c-dashboardInfo {
  margin-bottom: 15px;
}
.c-dashboardInfo .wrap {
  background: #ffffff;
  box-shadow: 2px 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 40px 25px 20px;
  height: 100%;
}
.c-dashboardInfo__title,
.c-dashboardInfo__subInfo {
  color: #6c6c6c;
  font-size: 1.18em;
}
.c-dashboardInfo span {
  display: block;
}
.c-dashboardInfo__count {
  font-weight: 600;
  font-size: 2.5em;
  line-height: 64px;
  color: #323c43;
}
.c-dashboardInfo .wrap:after {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  content: "";
}

.c-dashboardInfo:nth-child(1) .wrap:after {
  background: linear-gradient(82.59deg, #00c48c 0%, #7b0db6 100%);
}
.c-dashboardInfo:nth-child(2) .wrap:after {
  background: linear-gradient(81.67deg, #0084f4 0%, #1a4da2 100%);
}
.c-dashboardInfo:nth-child(3) .wrap:after {
  background: linear-gradient(69.83deg, #e20780 0%, #550303 100%);
}
.c-dashboardInfo:nth-child(4) .wrap:after {
  background: linear-gradient(81.67deg, #ff647c 0%, #1f5dc5 100%);
}
.c-dashboardInfo__title svg {
  color: #d7d7d7;
  margin-left: 5px;
}
.MuiSvgIcon-root-19 {
  fill: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 24px;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  flex-shrink: 0;
}
</style>
