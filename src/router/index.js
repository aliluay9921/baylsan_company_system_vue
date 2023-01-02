import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/login.vue";
import Employees from "../views/Employees.vue";
import Worker from "../views/Worker.vue";
import importSystem from "../views/Sale.vue";
import Log from "../views/Log.vue";
import Guarantee from "../views/Guarntee.vue";
import Statistics from "../views/statistics.vue";

import store from "../store/index";
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
      requiresAuth: true,
    }
  },
  {
    path: "/workers",
    name: "worker",
    component: Worker,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/importSystem",
    name: "importSystem",
    component: importSystem,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/logs",
    name: "logs",
    component: Log,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/guarantees",
    name: "guarantees",
    component: Guarantee,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/statistics",
    name: "statistics",
    component: Statistics,
    meta: {
      requiresAuth: true,
    }
  },

];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireNotLogin)) {
    if (store.getters.isLoggedIn) {
      next("/");
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});


export default router;
