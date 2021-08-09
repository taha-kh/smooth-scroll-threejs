import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VAnimateCss from "v-animate-css";
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false;
Vue.use(VAnimateCss);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
