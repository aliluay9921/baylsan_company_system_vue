<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.customer_name"
              placeholder="اسم ألزبون"
              label="اسم ألزبون"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.price"
              placeholder="أدخل السعر الكلي "
              label="أدخل السعر الكلي "
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.remainder_price"
              placeholder="أدخل القيمة المستلم"
              label="أدخل القيمة المستلم"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.received_price"
              placeholder="أدخل القيمة المتبقية"
              label="أدخل القيمة المتبقية"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="workers"
              v-model="selected_object.worker_id"
              item-text="full_name"
              item-value="id"
              label=" اختر عاملة"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="request_type"
              v-model="selected_object.request_type"
              item-text="text"
              item-value="value"
              label=" اختر نوع الطلب"
            ></v-autocomplete>
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
      request_type: [
        { text: "يومي", value: 0 },
        { text: "أسبوعي", value: 1 },
        { text: "شهري", value: 2 },
        { text: "سنوي", value: 3 },
      ],
    };
  },
  computed: {
    workers() {
      return this.$store.state.worker.workers;
    },
    selected_object() {
      return this.$store.state.importSystem.selected_object;
    },
    isEdit() {
      return this.$store.state.importSystem.isEdit;
    },
  },
  methods: {
    getWorkers() {
      this.$store.dispatch("worker/getWorkers");
    },
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["customer_name"] = this.selected_object.customer_name;
        data["worker_id"] = this.selected_object.worker_id;
        data["request_type"] = this.selected_object.request_type;
        data["price"] = this.selected_object.price;
        data["remainder_price"] = this.selected_object.remainder_price;
        data["received_price"] = this.selected_object.received_price;
        console.log(data);
        return;
        if (this.isEdit) {
          //   data["worker_id"] = this.selected_object.id;
          this.editData(data);
        } else {
          this.addData(data);
        }
      }
    },
    addData(data) {
      this.$store.dispatch("importSystem/addSale", data);
      this.$store.dispatch("importSystem/getSales", data);
      this.reset();
    },
    // editData(data) {
    //   this.$store.dispatch("importSystem/editSale", data);
    // },
    reset() {
      this.$refs.form.reset();
      this.$store.state.importSystem.isEdit = false;
    },
  },
  created() {
    this.getWorkers();
  },
};
</script>
