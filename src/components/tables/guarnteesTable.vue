<template>
  <v-card class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="guarntees"
      :options.sync="pagination"
      :loading="table_loading || false"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ index + 1 }}</td>

          <td class="text-start">{{ item.customer_name }}</td>
          <td class="text-start">{{ item.worker.full_name }}</td>
          <td class="text-start">{{ item.finger_print_intelligence }}</td>
          <td class="text-start">{{ item.book_work }}</td>
          <td class="text-start">{{ item.note }}</td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الكفالات</v-toolbar-title>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="guarnteeQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>
    </v-data-table>
    <div class="text-center pt-2 mt-3">
      <v-row>
        <v-col align-self="center" cols="2" offset="2">
          <v-select
            v-model="pagination.itemsPerPage"
            :items="items"
            label="عدد العناصر في الصفحة"
          ></v-select>
        </v-col>
        <v-col align-self="center" cols="4">
          <v-pagination
            v-model="pagination.page"
            :length="pageCount"
            circle
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      search: "",
      item: {},

      headers: [
        {
          text: "التسلسل",
          align: "sequence",
          class: "new white--text title",
        },
        {
          text: "أسم الزبون",
          value: "customer_name",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "أسم العاملة",
          value: "worker_id",
          align: "start",
          class: "new white--text title ",
        },

        {
          text: "بصمة المخابرات ",
          value: "finger_print_intelligence",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "دفتر العمل",
          value: "book_work",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "ملاحظات  ",
          value: "note",
          align: "start",
          class: "new white--text title ",
        },
      ],
      note: "",
      value: "",
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog: false,
    };
  },
  computed: {
    guarntees() {
      return this.$store.state.guarntee.guarntees;
    },
    table_loading() {
      return this.$store.state.guarntee.table_loading;
    },
    pageCount: function () {
      return this.$store.state.guarntee.pageCount;
    },
    totalItems: function () {
      return this.$store.state.guarntee.sales.length;
    },
    guarnteeQuery: {
      set(val) {
        this.$store.state.guarntee.guarnteeQuery = val;
      },
      get() {
        return this.$store.state.guarntee.guarnteeQuery;
      },
    },
    guarntee_params: {
      set(val) {
        this.$store.state.guarntee.params = val;
      },
      get() {
        return this.$store.state.guarntee.params;
      },
    },
  },
  methods: {
    // selectedRaw(item) {
    //   console.log(item);
    //   this.$store.state.guarntee.selected_object = {};
    //   Object.assign(this.$store.state.guarntee.selected_object, item);
    //   this.$store.state.guarntee.isEdit = true;
    //   window.scrollTo({
    //     top: 0,
    //     left: 0,
    //     behavior: "smooth",
    //   });
    // },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item) {
      this.item = item;
      this.dialog = true;
    },

    getGuarntees() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.guarntee_params = par;
      this.$store.dispatch("guarntee/getGuarntees");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("guarntee/resetFields");
        this.pagination.page = 1;
        this.getGuarntees();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("guarntee/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getGuarntees();
        this.guarntee_params.page = 1;
      },
      deep: true,
    },
  },
};
</script>
<style>
/* هاي تخلي الهدر مرتب كلة */
.v-data-table-header th {
  white-space: nowrap;
}
</style>
