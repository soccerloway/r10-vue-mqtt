import Vue from 'vue'
import App from './App.vue'
import r10VueMqtt from './index.js'

Vue.use(r10VueMqtt, {
  hubName: '$mqttHub',
  clientUrl: 'ws://iot.eclipse.org:80/ws',
  clientOpts: {}
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
