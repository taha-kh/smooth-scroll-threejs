import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VAnimateCss from "v-animate-css";

Vue.config.productionTip = false;
Vue.use(VAnimateCss);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
