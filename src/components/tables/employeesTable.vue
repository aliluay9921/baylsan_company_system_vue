<template>
  <v-card class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 new white--text">
              حذف سيارة
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b> هل أنت متأكد من عملية الحذف </b></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="new"
                color="white darken-1"
                text
                @click="dialog = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="new"
                color="white darken-1"
                text
                @click="deleteEmployee()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="employees"
      :options.sync="pagination"
      :loading="table_loading || false"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item, index }">
        <tr @dblclick="selectedRaw(item)">
          <td>{{ index + 1 }}</td>

          <td class="text-start">{{ item.full_name }}</td>
          <td class="text-start">{{ item.age }}</td>
          <td class="text-start">{{ item.salary }}</td>
          <td class="text-start">{{ item.carrer_title }}</td>
          <td class="text-start" v-if="item.amount_withdraw_salary == 0">
            <v-chip dark color="green">لايوجد استقطاع خلال هذا الشهر</v-chip>
          </td>
          <td class="text-start" v-else>
            <v-chip dark color="accent">
              <b> {{ item.amount_withdraw_salary }}</b>
            </v-chip>
          </td>
          <td class="text-start">
            <v-btn dark color="error" @click="getItem(item)">حذف</v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الموظفين</v-toolbar-title>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="employeeQuery"
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
          text: "أسم الموظف",
          value: "full_name",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "العمر",
          value: "age",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "الراتب",
          value: "salary",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "العنوان الوظيفي",
          value: "carrer_title",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "الاستقطاع الشهري",
          value: "amount_withdraw_salary",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "الحذف",
          value: "action",
          align: "start",
          class: "new white--text title ",
        },
      ],
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog: false,
    };
  },
  computed: {
    employees() {
      return this.$store.state.employee.employees;
    },
    table_loading() {
      return this.$store.state.employee.table_loading;
    },
    pageCount: function () {
      return this.$store.state.employee.pageCount;
    },
    totalItems: function () {
      return this.$store.state.employee.employees.length;
    },
    employeeQuery: {
      set(val) {
        this.$store.state.employee.employeeQuery = val;
      },
      get() {
        return this.$store.state.employee.employeeQuery;
      },
    },
    employee_params: {
      set(val) {
        this.$store.state.employee.params = val;
      },
      get() {
        return this.$store.state.employee.params;
      },
    },
  },
  methods: {
    selectedRaw(item) {
      console.log(item);
      this.$store.state.employee.selected_object = {};
      Object.assign(this.$store.state.employee.selected_object, item);
      this.$store.state.employee.isEdit = true;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item) {
      this.item = item;
      this.dialog = true;
    },
    deleteEmployee() {
      console.log(this.item);

      this.$store.dispatch("employee/deleteEmployee", this.item);
      this.dialog = false;
      this.item = {};
    },
    getEmployees() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.employee_params = par;
      this.$store.dispatch("employee/getEmployees");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("employee/resetFields");
        this.pagination.page = 1;
        this.getEmployees();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("employee/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getEmployees();
        this.employee_params.page = 1;
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
