// src/router/index.js
import Vue from "vue";
import Router from "vue-router";

import App from "../App.vue";
import HoTich from "../components/hotich/HoTich.vue";
import Jira from "../Jira.vue"; // Tính năng riêng biệt

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: App,
    },
    {
      path: "/hotich",
      name: "HoTich",
      component: HoTich,
    },
    {
      path: "/jira",
      name: "Jira",
      component: Jira,
    },
  ],
});
