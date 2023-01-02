<template>
  <v-card class="elevation-1">
    <!-- delete worker -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 new white--text">
              حذف العاملة
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
                @click="deleteWorker()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- show activites -->

    <!-- <template>
      <v-row justify="center">
        <v-dialog v-model="dialog1" persistent max-width="690">
          <v-card>
            <v-card-title class="text-h5 new white--text">
              السجلات الخاصة بهذه العاملة
            </v-card-title>

            <v-card-text
              class="mt-5 text-h5 dark--text"
              v-for="(item, index) in worker_actions"
              :key="index"
              ><b> أسم العاملة:</b> {{ item.full_name }}
              <v-divider></v-divider>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="new"
                color="white darken-1"
                text
                @click="dialog1 = false"
              >
                غلق
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template> -->

    <v-data-table
      :headers="headers"
      :items="workers"
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
          <td class="text-start">{{ item.passport_no }}</td>
          <td class="text-start">{{ item.visa_number }}</td>
          <td class="text-start">{{ item.nationality }}</td>
          <td class="text-start">{{ item.age }}</td>
          <td class="text-start">{{ item.date_entry }}</td>
          <td class="text-start">{{ item.date_issuance_visa }}</td>
          <td class="text-start" v-if="item.cashing == 0">
            <v-chip color="error" outlined>لايوجد صرفيات </v-chip>
          </td>
          <td class="text-start" v-else>
            {{ item.cashing }}
          </td>
          <td
            class="text-start"
            style="display: flex; flex-diractions: row; padding: 5px"
          >
            <v-btn dark color="error" @click="getItem(item, (type = 0))"
              >حذف</v-btn
            >
            <!-- <v-btn
              dark
              color="darkblueshade"
              class="mr-2 ml-2"
              @click="getItem(item, (type = 1))"
              >النشاطات</v-btn
            > -->
          </td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول العاملات</v-toolbar-title>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="workerQuery"
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
          text: "أسم العاملة",
          value: "full_name",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "رقم الجواز",
          value: "passport_no",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "رقم الفيزا",
          value: "visa_number",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "الجنسية",
          value: "nationality",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "العمر ",
          value: "age",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "تأريخ الدخول ",
          value: "date_entry",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "تأريخ اصدار الفيزا ",
          value: "date_issuance_visa",
          align: "start",
          class: "new white--text title ",
        },
        {
          text: "الصرفيات",
          value: "cashing",
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
      worker_actions_read: {},
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog: false,
      dialog1: false,
    };
  },
  computed: {
    workers() {
      return this.$store.state.worker.workers;
    },
    worker_actions() {
      return this.$store.state.worker.worker_actions;
    },
    table_loading() {
      return this.$store.state.worker.table_loading;
    },
    pageCount: function () {
      return this.$store.state.worker.pageCount;
    },
    totalItems: function () {
      return this.$store.state.worker.workers.length;
    },
    workerQuery: {
      set(val) {
        this.$store.state.worker.workerQuery = val;
      },
      get() {
        return this.$store.state.worker.workerQuery;
      },
    },
    worker_params: {
      set(val) {
        this.$store.state.worker.params = val;
      },
      get() {
        return this.$store.state.worker.params;
      },
    },
  },
  methods: {
    selectedRaw(item) {
      console.log(item);
      this.$store.state.worker.selected_object = {};
      Object.assign(this.$store.state.worker.selected_object, item);
      this.$store.state.worker.isEdit = true;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item, type) {
      if (type == 0) {
        this.item = item;
        this.dialog = true;
      } else if (type == 1) {
        this.item = item;
        this.dialog1 = true;
        this.$store.dispatch("worker/resetFields");
        this.$store.dispatch("worker/showActions", item);
        console.log(this.worker_actions);
      }
    },
    deleteWorker() {
      console.log(this.item);

      this.$store.dispatch("worker/deleteWorker", this.item);
      this.dialog = false;
      this.item = {};
    },
    getWorkers() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.worker_params = par;
      this.$store.dispatch("worker/getWorkers");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("worker/resetFields");
        this.pagination.page = 1;
        this.getWorkers();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("worker/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getWorkers();
        this.worker_params.page = 1;
        this.$store.dispatch("worker/showActions");
        // console.log(typeof this.worker_actions);
        // console.log(this.worker_actions);

        // this.worker_actions.forEach((element) => {
        //   this.worker_actions_read.push(element);
        //   console.log(element.full_name);
        // });
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
