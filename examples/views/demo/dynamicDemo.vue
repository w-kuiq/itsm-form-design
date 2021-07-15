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
          },

          {
            type: "select", // 组件类型
            label: "产品角色", // 组件名称
            icon: "icon-xiala",
            options: {
              width: "100%", // 宽度
              defaultValue: undefined, // 下拉选框请使用undefined为默认值
              multiple: false, // 是否允许多选
              disabled: false, // 是否禁用
              clearable: false, // 是否显示清除按钮
              hidden: false, // 是否隐藏，false显示，true隐藏
              placeholder: "请选择", // 默认提示文字
              dynamicKey: "__ROLE_ID__",
              dynamicParam: "data",
              dynamic: true,
              dynamicUrl: "/itsm/api/v1/itsm/dynamic_data/product_role_list/", // 获取外部数据接口url
              dynamicType: {},
              options: [
                // 下拉选择项配置
                {
                  value: "1",
                  label: "下拉框1"
                },
                {
                  value: "2",
                  label: "下拉框2"
                }
              ],
              showSearch: false // 是否显示搜索框，搜索选择的项的值，而不是文字
            },
            model: "__ROLE_ID__", // 数据字段
            key: "__ROLE_ID__",
            rules: [
              // 校验规则
              {
                required: false,
                message: "必填项"
              }
            ],
            unique: false,
            is_inherited: false,
            is_combine: false, // 可被联动操作
            combine_item: "" // 联动操作对应字段
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
