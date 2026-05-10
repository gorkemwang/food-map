import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {createPinia} from 'pinia';
import persist from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(persist);

const app = createApp(App);
app.use(ElementPlus, {
    locale: zhCn
});
app.use(router);
app.use(pinia);
app.mount('#app');
