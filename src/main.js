import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Axios from "axios";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import moment from 'moment'
import Print from 'vue-print-nb'


Vue.prototype.moment = moment
Vue.use(Print);

import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
library.add(faUserSecret)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs
Vue.use(LottieAnimation); // add lottie-animation to your global scope

Vue.prototype.$http = Axios;

Vue.config.productionTip = false;
const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] =
    "Bearer " + token;
}
Axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    if (response.data.result != undefined && response.data.code != 200) {
      return Promise.reject(response.data.errors);
    }
    return response;
  },
  function (error) {
    // console.log(error.response.status);
    //error.response.status

    if (error.response.status == 402) {
      localStorage.removeItem("token");

      store.state.token = null;

      router.replace("/login");
    }
    // // console.log(error.response.data.message)
    let message = error.response.data.message;
    Object.keys(error.response.data.errors).forEach(element => {
      message = message + "\n" + error.response.data.errors[element][0]
    });
    error.response.data.message = message
    // // console.log(message)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
