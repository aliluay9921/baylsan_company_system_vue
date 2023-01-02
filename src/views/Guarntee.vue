<template>
  <v-container>
    <v-card class="mt-5" elevation="4" shaped>
      <v-toolbar dark color="new">
        <v-toolbar-title align-center>الكفالات</v-toolbar-title>
      </v-toolbar>

      <v-card-text> <addGuarnteeForm></addGuarnteeForm> </v-card-text>
    </v-card>

    <v-card style="margin-top: 50px" elevation="12" shaped>
      <guarnteesTable></guarnteesTable>
    </v-card>
  </v-container>
</template>
<script>
// @ is an alias to /src
import addGuarnteeForm from "../components/forms/addGuarnteeForm.vue";
import guarnteesTable from "../components/tables/guarnteesTable.vue";

export default {
  name: "Home",
  components: {
    guarnteesTable,
    addGuarnteeForm,
  },
};
</script>
