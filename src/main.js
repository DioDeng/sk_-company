import { createApp } from 'vue';
import {
  Field, Form, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as rules from '@vee-validate/rules';
// 引入 VeeValidate 的 i18n 功能
import { localize, setLocale } from '@vee-validate/i18n';
// 引入 VeeValidate 的繁體中文語系檔
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import mitt from 'mitt';
import 'bootstrap';
import App from './App.vue';
import router from './router';

// 使用 Object.keys 將 AllRules 轉為陣列並使用 forEach 迴圈將驗證規則加入 VeeValidate
// Object.keys(rules).forEach((rule) => {
//   defineRule(rule, rules[rule]);
// });
Object.keys(rules).forEach((rule) => {
  if (typeof rules[rule] === 'function') {
    defineRule(rule, rules[rule]);
  }
});

// 將當前 VeeValidate 的語系設定為繁體中文
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});
setLocale('zh_TW');

const emitter = mitt();
const app = createApp(App);

app.config.globalProperties.$emitter = emitter;

// 掛載 Global 的 VeeValidate 元件
app.component('VField', Field);
app.component('VForm', Form);
app.component('ErrorMessage', ErrorMessage);

app.use(LoadingPlugin);
app.use(router);
app.mount('#app');
