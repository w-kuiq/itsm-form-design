<!--
 * @Author: wangkq
 * @Date: 2020-06-13 11:48:37
 * @LastEditTime: 2020-06-19 15:38:02
 * @LastEditors: wangkq
 * @Description: 
 * @FilePath: /itsm-form-design/examples/views/demo/dynamicDemo.vue
 * @可以输入预定的版权声明、个性签名、空行等
--> 
<template>
  <div>
    <k-form-build :value="jsonData" ref="KFB" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      description: "",
      jsonData: {
        list: [
          {
            type: "select",
            label: "下拉选择器",
            options: {
              width: "100%",
              multiple: false,
              disabled: false,
              clearable: false,
              hidden: false,
              placeholder: "请选择",
              dynamicKey: "select_1592025999222",
              dynamicParam: "items",
              dynamic: true,
              dynamicUrl:
                "http://rap2.taobao.org:38080/app/mock/256811/checkbox",
              dynamicType: {},
              options: [
                {
                  value: "1",
                  label: "下拉框1"
                },
                {
                  value: "2",
                  label: "下拉框2"
                }
              ],
              showSearch: false
            },
            model: "select_1592025999222",
            key: "select_1592025999222",
            rules: [
              {
                required: false,
                message: "必填项"
              }
            ]
          }
        ],
        config: {
          layout: "horizontal",
          labelCol: {
            span: 4
          },
          wrapperCol: {
            span: 18
          },
          hideRequiredMark: false,
          customStyle: ""
        },
        desc: {
          select_1592025999222: {
            label: "下拉选择器",
            type: "select",
            required: false,
            dynamic: true,
            dynamicKey: "select_1592025999222",
            dynamicUrl: "http://rap2.taobao.org:38080/app/mock/256811/checkbox",
            dynamicParam: "items"
          }
        }
      },
      dynamicData: {}
    };
  },
  mounted() {
    // 表单初始化渲染
    // this.initForm(this.$route.query.id);
    // this.$refs.KFB.getDynamicData();
    //异步请求数据渲染
    this.dynamicDataInit();
  },
  methods: {
    dynamicDataInit(){
      this.$nextTick(function(){
        this.$refs.KFB.getDynamicData();
      })
    }
  }
};
</script>
