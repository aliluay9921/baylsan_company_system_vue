import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/login.vue";
import Employees from "../views/Employees.vue";
import Worker from "../views/Worker.vue";
import importSystem from "../views/Sale.vue";
import Log from "../views/Log.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      requireNotLogin: true,
    }
  },
  {
    path: "/employees",
    name: "employees",
    component: Employees,
    meta: {
      requireNotLogin: true,
    }
  },
  {
    path: "/workers",
    name: "worker",
    component: Worker,
    meta: {
      requireNotLogin: true,
    }
  },
  {
    path: "/importSystem",
    name: "importSystem",
    component: importSystem,
    meta: {
      requireNotLogin: true,
    }
  },
  {
    path: "/logs",
    name: "logs",
    component: Log,
    meta: {
      requireNotLogin: true,
    }
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
