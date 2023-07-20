import Vue from 'vue'
import App from './App.vue'
import JanusJs from './janusplugin'
Vue.config.productionTip = false
Vue.use(JanusJs, { server: 'ws://127.0.0.1:8188' })
new Vue({
    render: (h) => h(App),
}).$mount('#app')
