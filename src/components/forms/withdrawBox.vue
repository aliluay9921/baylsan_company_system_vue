<template>
  <v-container>
    <v-form ref="form">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="request_type"
              v-model="type"
              item-text="text"
              item-value="value"
              label="نوع العملية"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="value"
              placeholder="أدخل القيمة "
              label="أدخل القيمة "
              hide-details="auto"
              clearable
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-autocomplete
              v-if="type == 0"
              clearable
              :items="employees"
              v-model="employee_id"
              item-text="full_name"
              item-value="id"
              label=" اختر الموظف"
            ></v-autocomplete>

            <v-autocomplete
              v-if="type == 1"
              clearable
              :items="workers"
              v-model="worker_id"
              item-text="full_name"
              item-value="id"
              label=" اختر عاملة"
              ref="workerDropdown"
              :loading="loading"
              :menu-props="menu_props"
              :search-input.sync="workerQuery"
              :value="workerQuery"
            >
              <template v-slot:append-item>
                <div
                  v-if="!($store.state.worker.worker_state == 'finished')"
                  v-intersect="workerInteract"
                  class="text-xs-center"
                ></div>
              </template>
              <template slot="no-data">
                <v-layout justify-start align-content-center class="pa-2">
                  جاري التحميل يرجى الأنتظار
                </v-layout>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="note"
              placeholder="أضف ملاحضة"
              label="أضف ملاحضة"
              hide-details="auto"
              clearable
            ></v-text-field>
          </v-col>
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
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn dark color="new" @click="validateField"> سحب </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn dark color="new" @click="reset"> تصفير الحقول </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-form></v-container
  >
</template>
<script>
export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || "هذا الحقل مطلوب.",
      },
      request_type: [
        { text: "سحب قرض موظف", value: 0 },
        { text: "سحب صرفيات عاملة", value: 1 },
        { text: "اخرى", value: 2 },
      ],
      type: "",
      value: "",
      note: "",
      employee_id: "",
      worker_id: "",
      menu: null,
      date: "",
      menu_props: {
        closeOnClick: false,
        closeOnContentClick: false,
        disableKeys: true,
        openOnClick: false,
        maxHeight: 150,
        offsetY: true,
        offsetOverflow: true,
        transition: false,
      },
    };
  },
  computed: {
    loading() {
      return this.$store.state.worker.table_loading;
    },
    employees() {
      return this.$store.state.employee.employees;
    },
    workers() {
      return this.$store.state.worker.workers;
    },
    workerQuery: {
      get() {
        return this.$store.state.worker.workerQuery;
      },
      set(value) {
        this.$store.state.worker.workerQuery = value;
      },
    },
  },
  methods: {
    getEmployees() {
      this.$store.dispatch("employee/getEmployees");
    },
    updateWorkerSearch(value) {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        if (this.workerQuery == null) {
          return;
        }
        this.$store.dispatch("worker/resetFields");
        this.$store.state.worker.params.page = 1;
        // console.log(this.$store.state.worker.params);

        if (
          this.workerQuery.length == 0 ||
          (this.workerQuery.length == 1 && this.workerQuery == " ")
        )
          this.workerQuery = value.replace(/\s/g, "");
        // هاي تلغي ال space
        else {
          this.$store.state.worker.workerQuery = value;
          // console.log(value);
          // console.log(this.$store.state.worker.workerQuery);
        }
        this.$store.dispatch("worker/resetFields");
        this.getWorkers();
      }, 1000);
    },
    workerInteract(entries, observer, isIntersecting) {
      if (isIntersecting) {
        setTimeout(() => {
          this.getWorkers(); // onscroll
          // console.log("on scroll");
          this.$refs.workerDropdown.onScroll();
        }, 500);
      }
    },
    getWorkers() {
      if (this.$store.state.worker.worker_state == "finished") return;

      this.$store.dispatch("worker/getWorkers");
    },
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["type"] = this.type;
        data["value"] = this.value;
        data["note"] = this.note;
        data["date"] = this.date;
        data["employee_id"] = this.employee_id;
        data["worker_id"] = this.worker_id;

        this.addData(data);
      }
    },
    addData(data) {
      this.$store.dispatch("actions/withdrawFromBox", data);
      this.$store.dispatch("actions/getLogs", data);
      this.note = "";
      this.value = "";
    },

    reset() {
      this.$refs.form.reset();
    },
  },
  created() {
    this.getEmployees();
    this.getWorkers();
  },
  watch: {
    workerQuery: function () {
      this.$store.dispatch("worker/resetFields");
      this.updateWorkerSearch(this.workerQuery);
    },
  },
};
</script>
