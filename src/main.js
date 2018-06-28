// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import axios from 'axios';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vuetify);

Vue.$http = axios;

Vue.filter('currency', value => {
  const resultValue = value ? value.toLocaleString('en') : 0;

  return `₩${resultValue}`;
});

Vue.filter('percentage', value => {
  const resultValue = value ? value * 100 : 0;

  return `${resultValue.toFixed(2)}%`;
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
