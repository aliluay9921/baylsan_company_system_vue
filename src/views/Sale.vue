<template>
  <v-container>
    <v-card class="mt-5" elevation="4" shaped>
      <v-toolbar dark color="new">
        <v-toolbar-title align-center>المبيعات</v-toolbar-title>
      </v-toolbar>

      <v-card-text> <addSaleForm></addSaleForm> </v-card-text>
    </v-card>

    <v-card style="margin-top: 50px" elevation="12" shaped>
      <salesTable></salesTable>
    </v-card>
  </v-container>
</template>
<script>
// @ is an alias to /src
import addSaleForm from "../components/forms/addSaleForm.vue";
import salesTable from "../components/tables/salesTable.vue";

export default {
  name: "Home",
  components: {
    salesTable,
    addSaleForm,
  },
};
</script>
