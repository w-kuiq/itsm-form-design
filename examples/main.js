import Vue from "vue";
import App from "./App.vue";
import router from "./router/";

import {
  KFormDesign,
  KFormBuild,
  // setFormDesignConfig
} from "../packages/index";
// import Cmp from "./components/CustomComponent/index.vue";

// setFormDesignConfig({
//   title: "测试自定义字段",
//   list: [
//     {
//       type: "select", // 表单类型
//       label: "自定义组件", // 标题文字
//       icon: "icon-gallery",
//       component: Cmp,
//       options: {
//         width: "100%", // 宽度
//         defaultValue: undefined, // 下拉选框请使用undefined为默认值
//         multiple: false, // 是否允许多选
//         disabled: false, // 是否禁用
//         clearable: false, // 是否显示清除按钮
//         hidden: false, // 是否隐藏，false显示，true隐藏
//         placeholder: "请选择", // 默认提示文字
//         dynamicKey: "",
//         dynamicParam:"items",
//         dynamic: false,
//         dynamicUrl: "http://rap2.taobao.org:38080/app/mock/256811/checkbox", //获取外部数据接口url
//         dynamicType: {},
//         options: [
//           // 下拉选择项配置
//           {
//             value: "1",
//             label: "下拉框1"
//           },
//           {
//             value: "2",
//             label: "下拉框2"
//           }
//         ],
//         showSearch: false // 是否显示搜索框，搜索选择的项的值，而不是文字
//       },
//       model: "role",
//       key: "role",
//       rules: [
//         {
//           required: false,
//           message: "必填项"
//         }
//       ]
//     }
//   ],
//   uploadFile: "",
//   uploadImage: "",
//   uploadFileName: "",
//   uploadImageName: "",
//   uploadFileData: { data: 1545 },
//   uploadImageData: { data: 1545 },
//   uploadFileHeaders: { data: 1545 },
//   uploadImageHeaders: { data: 1545 }
// });
Vue.use(KFormDesign);
Vue.use(KFormBuild);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
