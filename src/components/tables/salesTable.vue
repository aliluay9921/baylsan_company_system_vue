<template>
  <v-card class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="690">
          <v-card>
            <v-card-title class="text-h5 new white--text">
              استرجاع عاملة
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b> هل أنت متأكد من عملية الأسترجاع </b>
              <v-form ref="form">
                <v-col cols="12" md="12" lg="12">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="note"
                        placeholder="أضف ملاحضة"
                        label="أضف ملاحضة"
                        hide-details="auto"
                        clearable
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="value"
                        placeholder="أدخل القيمة المسترجعة"
                        label="أدخل القيمة المسترجعة"
                        hide-details="auto"
                        clearable
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" align-self="center" class="text-center">
                      <v-row justify="center" class="mt-5">
                        <v-col cols="auto">
                          <v-btn dark color="new" @click="recoveryWorker()">
                            تأكيد العملية
                          </v-btn>
                        </v-col>
                        <v-col cols="auto">
                          <v-btn dark color="new" @click="dialog = false">
                            غلق
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="sales"
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

          <td class="text-start">{{ item.customer_name }}</td>
          <td class="text-start">{{ item.worker.full_name }}</td>
          <td class="text-start">
            <v-chip dark color="red" v-if="item.request_type == 0">يومي</v-chip>
            <v-chip dark color="green" v-if="item.request_type == 1"
              >اسبوعي</v-chip
            >
            <v-chip dark color="yellow" v-if="item.request_type == 2"
              >شهري</v-chip
            >
            <v-chip dark color="blue" v-if="item.request_type == 3"
              >سنوي</v-chip
            >
          </td>
          <td class="text-start">{{ item.price }}</td>
          <td class="text-start">{{ item.remainder_price }}</td>
          <td class="text-start">{{ item.received_price }}</td>

          <td class="text-start">
            <v-chip color="success" outlined v-if="item.status == 0">
              تم البيع
            </v-chip>
            <v-chip color="error" outlined v-else> تم الاسترجاع </v-chip>
          </td>
          <td class="text-start">
            <span>{{ moment(item.created_at).format("YYYY-MM-DD") }}</span>
          </td>
          <td class="text-start">{{ item.note }}</td>
          <td class="text-start">
            <v-btn
              dark
              color="error"
              @click="getItem(item)"
              v-if="item.status == 0"
              >استرجاع</v-btn
            >
            <v-btn dark color="info" v-else>تم استرجاعه</v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول المبيعات</v-toolbar-title>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="salesQuery"
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
          text: "نوع الطلب",
          value: "request_type",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "ألسعر",
          value: "price",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "القيمة المستلمة",
          value: "remainder_price",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "القيمة المتبقية",
          value: "received_price",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "الحالة ",
          value: "status",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "تأريخ البيع ",
          value: "created_at",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "ملاحظات  ",
          value: "note",
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
      note: "",
      value: "",
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog: false,
    };
  },
  computed: {
    sales() {
      return this.$store.state.importSystem.sales;
    },
    table_loading() {
      return this.$store.state.importSystem.table_loading;
    },
    pageCount: function () {
      return this.$store.state.importSystem.pageCount;
    },
    totalItems: function () {
      return this.$store.state.importSystem.sales.length;
    },
    salesQuery: {
      set(val) {
        this.$store.state.importSystem.salesQuery = val;
      },
      get() {
        return this.$store.state.importSystem.salesQuery;
      },
    },
    sales_params: {
      set(val) {
        this.$store.state.importSystem.params = val;
      },
      get() {
        return this.$store.state.importSystem.params;
      },
    },
  },
  methods: {
    selectedRaw(item) {
      console.log(item);
      this.$store.state.importSystem.selected_object = {};
      Object.assign(this.$store.state.importSystem.selected_object, item);
      this.$store.state.importSystem.isEdit = true;
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
    recoveryWorker() {
      console.log(this.item);

      let data = {};
      data["worker_id"] = this.item.worker_id;
      data["sale_id"] = this.item.id;
      data["note"] = this.note;
      data["value"] = this.value;
      console.log(data);
      //   return;
      this.$store.dispatch("importSystem/recoveryWorker", data);
      this.dialog = false;
      this.item = {};
    },
    getSales() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.sales_params = par;
      this.$store.dispatch("importSystem/getSales");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("importSystem/resetFields");
        this.pagination.page = 1;
        this.getSales();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("importSystem/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getSales();
        this.sales_params.page = 1;
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
