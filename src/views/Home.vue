<template>
  <div class="home">
    <v-row>
      <v-col cols="12" sm="4">
        <v-card elevation="8" outlined shaped to="/employees">
          <v-card-title class="text-h5">
            <div class="icon">
              <i class="fa fa-users" aria-hidden="true"></i>
            </div>
          </v-card-title>
          <v-card-text class="mt-5 text-h4 dark--text text-center"
            ><b>الموظفين</b>
          </v-card-text>
          <v-card-actions> </v-card-actions
        ></v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card elevation="8" outlined shaped to="/workers">
          <v-card-title class="text-h5">
            <div class="icon">
              <i class="fa fa-female" aria-hidden="true"></i>
            </div>
          </v-card-title>
          <v-card-text class="mt-5 text-h4 dark--text text-center"
            ><b>العاملات</b>
          </v-card-text>
          <v-card-actions> </v-card-actions
        ></v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card elevation="8" outlined shaped to="/guarantees">
          <v-card-title class="text-h5">
            <div class="icon">
              <i class="fa fa-address-card" aria-hidden="true"></i>
            </div>
          </v-card-title>
          <v-card-text class="mt-5 text-h4 dark--text text-center"
            ><b>الكفالات</b>
          </v-card-text>
          <v-card-actions> </v-card-actions
        ></v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card elevation="8" outlined shaped to="/logs">
          <v-card-title class="text-h5">
            <div class="icon">
              <i class="fa fa-address-book" aria-hidden="true"></i>
            </div>
          </v-card-title>
          <v-card-text class="mt-5 text-h4 dark--text text-center"
            ><b>سجلات</b>
          </v-card-text>
          <v-card-actions> </v-card-actions
        ></v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card elevation="8" outlined shaped to="/importSystem">
          <v-card-title class="text-h5">
            <div class="icon">
              <i class="fa fa-address-book" aria-hidden="true"></i>
            </div>
          </v-card-title>
          <v-card-text class="mt-5 text-h4 dark--text text-center"
            ><b>المبيعات</b>
          </v-card-text>
          <v-card-actions> </v-card-actions
        ></v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <!-- <v-card elevation="8" outlined shaped to="/statistics"> -->
        <v-card elevation="8" outlined shaped to="">
          <v-card-title class="text-h5">
            <div class="icon">
              <i class="fa fa-percent" aria-hidden="true"></i>
            </div>
          </v-card-title>
          <v-card-text class="mt-5 text-h4 dark--text text-center"
            ><b>أحصائيات</b>
          </v-card-text>
          <v-card-actions> </v-card-actions
        ></v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>
<style>
.home {
  padding: 30px 100px 0 100px;
}
/* .main_card {
  padding: 20px;
} */
.icon {
  padding: 10px;
  text-align: center;
  width: 100%;
}
.icon i {
  color: rgb(74, 51, 180);
  font-size: 90px;
}
</style>
