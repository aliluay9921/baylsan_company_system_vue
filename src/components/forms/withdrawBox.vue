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
            ></v-autocomplete>
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
    };
  },
  computed: {
    employees() {
      return this.$store.state.employee.employees;
    },
    workers() {
      return this.$store.state.worker.workers;
    },
  },
  methods: {
    getEmployees() {
      this.$store.dispatch("employee/getEmployees");
    },
    getWorkers() {
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
};
</script>
