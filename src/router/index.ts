import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import TheDarkSideOfTheMoon from "../views/Albums/TheDarkSideOfTheMoon.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/TheDarkSideOfTheMoon",
    name: "TheDarkSideOfTheMoon",
    component: TheDarkSideOfTheMoon,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
