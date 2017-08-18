import 'bulma/css/bulma.css'
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import db from './db'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(db, ['http://peer.1.apily.co.uk:3272/gun', 'http://peer.2.apily.co.uk:3272/'])
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
