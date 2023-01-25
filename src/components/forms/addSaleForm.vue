<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="3">
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
              v-model="selected_object.note"
              placeholder="أضف ملاحضة"
              label="أضف ملاحضة"
              hide-details="auto"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="selected_object.price"
              placeholder="أدخل السعر الكلي "
              label="أدخل السعر الكلي "
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
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
import { watch } from "vue";
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
    workers() {
      return this.$store.state.worker.workers;
    },
    selected_object() {
      return this.$store.state.importSystem.selected_object;
    },
    isEdit() {
      return this.$store.state.importSystem.isEdit;
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
        data["customer_name"] = this.selected_object.customer_name;
        data["worker_id"] = this.selected_object.worker_id;
        data["request_type"] = this.selected_object.request_type;
        data["price"] = this.selected_object.price;
        data["remainder_price"] = this.selected_object.remainder_price;
        data["received_price"] = this.selected_object.received_price;
        data["note"] = this.selected_object.note;
        // console.log(data);
        // return;
        if (this.isEdit) {
          data["sale_id"] = this.selected_object.id;
          this.editData(data);
        } else {
          this.addData(data);
        }
      }
    },
    addData(data) {
      this.$store.dispatch("importSystem/addSale", data);
      this.$store.dispatch("importSystem/getSales", data);
      // this.reset();
    },
    editData(data) {
      this.$store.dispatch("importSystem/editSale", data);
    },
    reset() {
      this.$refs.form.reset();
      this.$store.state.importSystem.isEdit = false;
    },
  },
  created() {
    this.getWorkers();
  },
  watch: {
    workerQuery: function () {
      this.$store.dispatch("worker/resetFields");
      this.updateWorkerSearch(this.workerQuery);
    },
    workers() {
      console.log(this.workers);
    },
  },
};
</script>
