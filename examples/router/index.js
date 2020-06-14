/*
 * @Author: wangkq
 * @Date: 2020-05-31 13:55:47
 * @LastEditTime: 2020-06-13 11:53:57
 * @LastEditors: wangkq
 * @Description: 
 * @FilePath: /itsm-form-design/examples/router/index.js
 * @可以输入预定的版权声明、个性签名、空行等
 */ 
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "formDesign"
    },
    {
      path: "/formDesign",
      name: "formDesign",
      component: () => import("../views/formDesign/index.vue")
    },
    {
      path: "/demo",
      name: "demo",
      component: () => import("../views/demo/index.vue")
    },
    {
      path: "/dynamicDemo",
      name: "dynamicDemo",
      component: () => import("../views/demo/dynamicDemo.vue")
    }
  ]
});
