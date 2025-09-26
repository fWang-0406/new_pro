// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './assets/styles/global.css'
import store from './stores' //

createApp(App).use(router).use(store).mount('#app')