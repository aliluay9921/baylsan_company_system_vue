<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.full_name"
              placeholder="اسم الموظف"
              label="اسم الموظف"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.age"
              placeholder="أدخل عمر الموظف"
              label="أدخل عمر الموظف"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.salary"
              placeholder="أدخل راتب الموظف"
              label="أدخل راتب الموظف"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.carrer_title"
              placeholder="أدخل العنوان الوظيفي"
              label="أدخل العنوان الوظيفي"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn dark color="new" @click="validateField">
                  {{ isEdit ? "تعديل القيد" : "أضافة قيد" }}
                </v-btn>
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
      full_name: "",
      age: "",
      salary: "",
      carrer_title: "",
      rules: {
        required: (value) => !!value || "هذا الحقل مطلوب.",
        // min: (v) => v.length >= 6 || "يجب ان تكون كلمة المرور اكثر من 6 عناصر",
      },
    };
  },
  computed: {
    selected_object() {
      return this.$store.state.employee.selected_object;
    },
    isEdit() {
      return this.$store.state.employee.isEdit;
    },
  },
  methods: {
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["full_name"] = this.selected_object.full_name;
        data["age"] = this.selected_object.age;
        data["salary"] = this.selected_object.salary;
        data["carrer_title"] = this.selected_object.carrer_title;

        if (this.isEdit) {
          data["employee_id"] = this.selected_object.id;
          this.editData(data);
        } else {
          this.addData(data);
        }
      }
    },
    addData(data) {
      this.$store.dispatch("employee/addEmployee", data);
      this.$store.dispatch("employee/getEmployees", data);
      this.reset();
    },
    editData(data) {
      this.$store.dispatch("employee/editEmployees", data);
    },
    reset() {
      this.$refs.form.reset();
      this.$store.state.employee.isEdit = false;
    },
  },
};
</script>
