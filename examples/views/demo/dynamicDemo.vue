<!--
 * @Author: wangkq
 * @Date: 2020-06-13 11:48:37
 * @LastEditTime: 2020-07-31 16:54:08
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
	"list": [
		{
			"type": "radio",
			"label": "单选框",
			"options": {
				"disabled": false,
				"hidden": false,
				"defaultValue": "",
				"dynamicKey": "status",
				"dynamic": false,
				"combineHandle": true,
				"options": [
					{
						"value": "1",
						"label": "选项1"
					},
					{
						"value": "2",
						"label": "选项2"
					},
					{
						"value": "3",
						"label": "选项3"
					}
				]
			},
			"model": "status",
			"key": "radio_1595927723938",
			"rules": [
				{
					"required": false,
					"message": "必填项"
				}
			],
			"unique": false,
			"is_inherited": false,
			"combine": true
		},
		{
			"type": "input",
			"label": "输入框",
			"icon": "icon-write",
			"options": {
				"type": "text",
				"width": "100%",
				"defaultValue": "",
				"placeholder": "请输入",
				"clearable": false,
				"maxLength": null,
				"hidden": true,
				"disabled": false,
				"combineHandle": false
			},
			"model": "input_1595927764511",
			"key": "input_1595927764511",
			"rules": [
				{
					"required": false,
					"message": "必填项"
				}
			],
			"unique": false,
			"is_inherited": false,
			"combine": true,
			"is_combine": true,
			"combine_item": "status==2"
		}
	],
	"config": {
		"layout": "horizontal",
		"labelCol": {
			"span": 4
		},
		"wrapperCol": {
			"span": 18
		},
		"hideRequiredMark": false,
		"customStyle": ""
	},
	"desc": {
		"status": {
			"label": "单选框",
			"type": "radio",
			"default": "",
			"required": false,
			"unique": false,
			"is_inherited": false,
			"combineHandle": true,
			"dynamic": false,
			"dynamicKey": "status",
			"disabled": false
		},
		"input_1595927764511": {
			"label": "输入框",
			"type": "input",
			"default": "",
			"required": false,
			"unique": false,
			"is_inherited": false,
			"combineHandle": false,
			"disabled": false
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
        // this.$refs.KFB.getDynamicData();
      })
    }
  }
};
</script>
<style scoped>
/deep/ .ant-form label{
  font-size:12px;
  font-weight:inherit
}
/deep/ .ant-form-item{
  margin-bottom: 6px;
}
/deep/ .ant-input[disabled],/deep/ .ant-select-disabled .ant-select-selection{
  background-color:#fff;
}
</style>

