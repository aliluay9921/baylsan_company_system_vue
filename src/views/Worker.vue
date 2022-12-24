<template>
  <v-container>
    <v-card class="mt-5" elevation="4" shaped>
      <v-toolbar dark color="new">
        <v-toolbar-title align-center>العاملات</v-toolbar-title>
      </v-toolbar>

      <v-card-text> <addWorkerForm></addWorkerForm> </v-card-text>
    </v-card>

    <v-card style="margin-top: 50px" elevation="12" shaped>
      <workersTable></workersTable>
    </v-card>
  </v-container>
</template>
<script>
// @ is an alias to /src
import addWorkerForm from "../components/forms/addWorkerForm.vue";
import workersTable from "../components/tables/workersTable.vue";

export default {
  name: "Home",
  components: {
    workersTable,
    addWorkerForm,
  },
};
</script>
