<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.full_name"
              placeholder="اسم العاملة"
              label="اسم العاملة"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.passport_no"
              placeholder="أدخل رقم الجواز  "
              label="أدخل رقم الجواز  "
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.nationality"
              placeholder="أدخل جنسية العاملة"
              label="أدخل جنسية العاملة"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="selected_object.age"
              placeholder="أدخل عمر العاملة"
              label="أدخل عمر العاملة"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="selected_object.visa_number"
              placeholder="أدخل رقم الفيزا"
              label="أدخل رقم الفيزا"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <!-- <v-text-field
              v-model="selected_object.date_entry"
              placeholder="أدخل تأريخ دخول العاملة"
              label="أدخل تأريخ دخول العاملة"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field> -->
            <v-menu
              v-model="selected_object.menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  clearable
                  v-model="selected_object.date_entry"
                  label="أدخل تأريخ دخول العاملة"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="selected_object.date_entry"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="4">
            <!-- <v-text-field
              v-model="selected_object.date_issuance_visa"
              placeholder="أدخل تأريخ اصدار الفيزا  "
              label="أدخل تأريخ اصدار الفيزا  "
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field> -->
            <v-menu
              v-model="selected_object.menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  clearable
                  v-model="selected_object.date_issuance_visa"
                  label="أدخل تأريخ اصدار الفيزا "
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="selected_object.date_issuance_visa"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
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
      menu: null,
      menu1: null,
      rules: {
        required: (value) => !!value || "هذا الحقل مطلوب.",
        // min: (v) => v.length >= 6 || "يجب ان تكون كلمة المرور اكثر من 6 عناصر",
      },
    };
  },
  computed: {
    selected_object() {
      return this.$store.state.worker.selected_object;
    },
    isEdit() {
      return this.$store.state.worker.isEdit;
    },
  },
  methods: {
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["full_name"] = this.selected_object.full_name;
        data["passport_no"] = this.selected_object.passport_no;
        data["nationality"] = this.selected_object.nationality;
        data["age"] = this.selected_object.age;
        data["visa_number"] = this.selected_object.visa_number;
        data["date_entry"] = this.selected_object.date_entry;
        data["date_issuance_visa"] = this.selected_object.date_issuance_visa;

        if (this.isEdit) {
          data["worker_id"] = this.selected_object.id;
          this.editData(data);
        } else {
          this.addData(data);
        }
      }
    },
    addData(data) {
      this.$store.dispatch("worker/addWorker", data);
      this.$store.dispatch("worker/getWorkers", data);
      this.reset();
    },
    editData(data) {
      this.$store.dispatch("worker/editWorker", data);
    },
    reset() {
      this.$refs.form.reset();
      this.$store.state.worker.isEdit = false;
    },
  },
};
</script>
