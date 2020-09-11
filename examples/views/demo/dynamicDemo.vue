<!--
 * @Author: wangkq
 * @Date: 2020-06-13 11:48:37
 * @LastEditTime: 2020-09-10 19:52:12
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
            type: "editor",
            label: "富文本",
            options: {
              height: 300,
              placeholder: "请输入",
              defaultValue: "aaa",
              chinesization: true,
              hidden: false,
              disabled: false,
              showLabel: false,
              width: "100%"
            },
            model: "editor_1599736596755",
            key: "editor_1599736596755",
            rules: [
              {
                required: false,
                message: "必填项"
              }
            ],
            is_combine: false,
            combine_item: ""
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
          editor_1599736596755: {
            label: "富文本",
            type: "editor",
            default: "",
            required: false,
            method: 1
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
    dynamicDataInit() {
      this.$nextTick(function() {
        // this.$refs.KFB.getDynamicData();
      });
    }
  }
};
</script>
<style scoped>
/deep/ .ant-form label {
  font-size: 12px;
  font-weight: inherit;
}
/deep/ .ant-form-item {
  margin-bottom: 6px;
}
/deep/ .ant-input[disabled],
/deep/ .ant-select-disabled .ant-select-selection {
  background-color: #fff;
}
</style>
