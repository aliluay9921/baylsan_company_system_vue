<template>
  <v-container>
    <v-card class="mt-5" elevation="4" shaped>
      <v-toolbar dark color="new">
        <v-toolbar-title align-center>العاملات</v-toolbar-title>
      </v-toolbar>

      <v-card-text> <withdrawBox></withdrawBox> </v-card-text>
    </v-card>

    <v-card style="margin-top: 50px" elevation="12" shaped>
      <logsTable></logsTable>
    </v-card>
  </v-container>
</template>
<script>
// @ is an alias to /src
import withdrawBox from "../components/forms/withdrawBox.vue";
import logsTable from "../components/tables/logsTable.vue";

export default {
  name: "Home",
  components: {
    logsTable,
    withdrawBox,
  },
};
</script>
