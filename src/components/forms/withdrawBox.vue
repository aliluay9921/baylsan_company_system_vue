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
            <v-text-field
              v-if="type == 1"
              v-model="note"
              placeholder="أضف ملاحضة"
              label="أضف ملاحضة"
              hide-details="auto"
              clearable
              required
            ></v-text-field>
            <v-autocomplete
              v-if="type == 0"
              clearable
              :items="employees"
              v-model="employee_id"
              item-text="full_name"
              item-value="id"
              label=" اختر الموظف"
            ></v-autocomplete>
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
        // min: (v) => v.length >= 6 || "يجب ان تكون كلمة المرور اكثر من 6 عناصر",
      },
      request_type: [
        { text: "سحب قرض موظف", value: 0 },
        { text: "اخرى", value: 1 },
      ],
      type: "",
      value: "",
      note: "",
      employee_id: "",
    };
  },
  computed: {
    employees() {
      return this.$store.state.employee.employees;
    },
  },
  methods: {
    getEmployees() {
      this.$store.dispatch("employee/getEmployees");
    },
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["type"] = this.type;
        data["value"] = this.value;
        data["note"] = this.note;
        data["employee_id"] = this.employee_id;

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
  },
};
</script>
