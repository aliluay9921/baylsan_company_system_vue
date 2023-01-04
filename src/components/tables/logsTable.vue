<template>
  <v-card class="elevation-1">
    <v-data-table
      id="print_me"
      :headers="headers"
      :items="logs"
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

          <td class="text-start" v-if="item.log_type == 0">
            <i
              class="fa fa-check-square"
              style="color: green; font-size: 30px"
              aria-hidden="true"
            ></i>
          </td>
          <td class="text-start" v-if="item.log_type == 1">
            <i
              style="color: red; font-size: 30px"
              class="fa fa-window-close"
              aria-hidden="true"
            ></i>
          </td>
          <td
            class="text-start"
            v-if="item.employee == null && item.worker == null"
          >
            <v-chip dark color="green">شركة</v-chip>
          </td>
          <td
            class="text-start"
            v-if="item.employee != null && item.worker == null"
          >
            <v-chip dark color="error"
              >موظف: {{ item.employee.full_name }}</v-chip
            >
          </td>
          <td
            class="text-start"
            v-if="item.employee == null && item.worker != null"
          >
            <v-chip dark color="info">
              عامل: {{ item.worker.full_name }}
            </v-chip>
          </td>
          <td class="text-start">{{ item.value }}</td>
          <td class="text-start" v-if="item.note == null">
            <v-chip dark color="error"> لايوجد ملاحظات</v-chip>
          </td>
          <td class="text-start" v-else>{{ item.note }}</td>
          <td class="text-start">
            <span>{{ moment(item.date).format("YYYY-MM-DD") }}</span>
          </td>
        </tr>
      </template>
      <template v-slot:top v-if="!isPrenting">
        <v-toolbar flat>
          <v-toolbar-title> السجلات</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-row style="margin-top: 15px">
            <v-col style="margin-right: 15px">
              <v-btn
                dark
                color="error"
                @click="hideHeaderTable"
                v-print="printObj"
                >طباعة</v-btn
              >
            </v-col>
            <v-col>
              <v-text-field
                v-model="logQuery"
                @input="queryChange"
                append-icon="mdi-magnify"
                label="بحث"
                single-line
                hide-details
                class="mr-5"
              ></v-text-field
            ></v-col>
            <v-col>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
                style="margin-top: 60px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="التأريخ"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  @input="menu = false"
                  @change="filter"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-toolbar>
      </template>
      <template v-slot:footer v-if="isPrenting">
        <div class="footer">
          <p>
            <b style="margin-right: 5px"> Ali Luay Khalaf</b>تم برمجة النظام
            بواسطة
          </p>
          <p>009647713982401</p>
        </div>
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
      isPrenting: false,
      headers: [
        {
          text: "التسلسل",
          align: "sequence",
          class: "new white--text title",
        },
        {
          text: "نوع العملية",
          value: "log_type",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "الهدف",
          value: "target_id",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "القيمة",
          value: "value",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "الملاحظات ",
          value: "note",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "التأريخ ",
          value: "date",
          align: "start",
          class: "new white--text title ",
        },
      ],
      pagination: {},
      items: [5, 10, 25, 50, 100],
      menu: null,
      date: "",
      printObj: {
        id: "print_me",
        popTitle: "شركة اليد البيضاء",
        extraHead: '<meta http-equiv="Content-Language"content="en-ar"/>',
        footer: `
          <div class="footer">
            This is a footer
          </div>
        `,

        beforeOpenCallback(vue) {
          vue.isPrenting = false;
        },
        openCallback(vue) {
          vue.isPrenting = true;
        },

        closeCallback(vue) {
          vue.isPrenting = false;
        },
      },
    };
  },
  computed: {
    logs() {
      return this.$store.state.actions.logs;
    },
    table_loading() {
      return this.$store.state.actions.table_loading;
    },
    pageCount: function () {
      return this.$store.state.actions.pageCount;
    },
    totalItems: function () {
      return this.$store.state.actions.logs.length;
    },
    logQuery: {
      set(val) {
        this.$store.state.actions.logQuery = val;
      },
      get() {
        return this.$store.state.actions.logQuery;
      },
    },
    log_params: {
      set(val) {
        this.$store.state.actions.params = val;
      },
      get() {
        return this.$store.state.actions.params;
      },
    },
  },
  methods: {
    hideHeaderTable() {
      this.isPrenting = true;

      console.log((this.isPrenting = true));
    },
    filter() {
      var filter = { name: "date", value: this.date };
      Object.assign(this.$store.state.actions.filter, filter);
      this.$store.dispatch("actions/getLogs");
      // this.getSalesCategories();
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item, type) {
      this.item = item;
      this.dialog = true;
    },

    getLogs() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.log_params = par;

      this.$store.dispatch("actions/getLogs");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.$store.dispatch("actions/resetFields");
        this.pagination.page = 1;

        this.getLogs();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("actions/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getLogs();
        this.log_params.page = 1;
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
