import 'bulma/css/bulma.css'

import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import db from './log-reader/db'
import watcher from './log-reader/watcher'

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
 // watcher.start()
}
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>',
}).$mount('#app');

