<template>
  <a-config-provider :locale="locale">
    <a-form
      v-if="
        typeof value.list !== 'undefined' && typeof value.config !== 'undefined'
      "
      class="k-form-build-9136076486841527"
      :layout="value.config.layout"
      :hideRequiredMark="value.config.hideRequiredMark"
      :form="form"
      @submit="handleSubmit"
      :style="value.config.customStyle"
    >
      <buildBlocks
        ref="buildBlocks"
        @handleReset="reset"
        v-for="(record, index) in value.list"
        :record="record"
        :dynamicData="dynamicData"
        :disabled="disabled"
        :config="value.config"
        :key="index"
        @change="handleChange"
      />
    </a-form>
  </a-config-provider>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 将json数据构建成表单
 */
import buildBlocks from "./buildBlocks";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import axios from "axios";

// import moment from "moment";
export default {
  name: "KFormBuild",
  data() {
    return {
      locale: zhCN,
      form: this.$form.createForm(this)
    };
  },
  // props: ["value", "dynamicData"],
  props: {
    value: {
      type: Object,
      required: true
    },
    dynamicData: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    outputString: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    buildBlocks
  },
  methods: {
    // moment,
    handleSubmit(e) {
      // 提交按钮触发，并触发submit函数，返回getData函数
      e.preventDefault();
      this.$emit("submit", this.getData);
    },
    reset() {
      // 重置表单
      this.form.resetFields();
    },
    getData() {
      // 提交函数，提供父级组件调用
      return new Promise((resolve, reject) => {
        try {
          this.form.validateFields((err, values) => {
            if (err) {
              reject(err);
            }
            this.$refs.buildBlocks.forEach(item => {
              if (!item.validationSubform()) {
                reject(err);
              }
            });
            if (this.outputString) {
              // 需要所有value转成字符串
              for (let key in values) {
                let type = typeof values[key];
                if (type === "string" || type === "undefined") {
                  continue;
                } else if (type === "object") {
                  values[key] = `k-form-design#${type}#${JSON.stringify(
                    values[key]
                  )}`;
                } else {
                  values[key] = `k-form-design#${type}#${String(values[key])}`;
                }
              }
              resolve(values);
            } else {
              resolve(values);
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    setData(json) {
      return new Promise((resolve, reject) => {
        try {
          if (this.outputString) {
            // 将非string数据还原
            for (let key in json) {
              if (!json[key].startsWith("k-form-design#")) {
                continue;
              }
              let array = json[key].split("#");
              if (array[1] === "object") {
                json[key] = JSON.parse(array[2]);
              } else if (array[1] === "number") {
                json[key] = Number(array[2]);
              } else if (array[1] === "boolean") {
                json[key] = Boolean(array[2]);
              }
            }
            this.form.setFieldsValue(json);
          } else {
            this.form.setFieldsValue(json);
          }
        } catch (err) {
          reject(err);
        }
      });
    },
    // 获取dynamicData
    getDynamicData() {
      let desc = this.value.desc;
      let list = this.value.list;
      let KeyArr = Object.keys(desc);
      let _this = this;
      KeyArr.forEach(function(item) {
        let listOption
        if (desc[item].hasOwnProperty("dynamicKey")) {
          if(desc[item].type == 'treeSelect'){
            for(let i of list){
              if(i.key == item){
                listOption = i.options
              }
            }
          }
          if(desc[item].dynamicUrl){
            _this.getAsyncData(
              desc[item].dynamicUrl,
              desc[item].dynamicKey,
              desc[item].dynamicParam,
              listOption||{}  //该控件的所有参数
            );
          }
          
        }
      });
      return this.dynamicData;
    },
    getAsyncData(url, key, param, listOption) {
      axios
        .get(url)
        .then(res => {
          if (res.status == 200) {
            if(listOption.treeSingleCheckable){ //如果树形控件勾选了只能勾选子节点
              this.recursionAddParams(res.data[param])
            }
            this.$set(this.dynamicData, key, res.data[param]);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    recursionAddParams(datas){
      datas.forEach((item,i)=>{
        if(item.children&&item.children.length>0){
          item.disabled = true
          this.recursionAddParams(item.children)
        }
      })
    },

    // 批量设置某个option的值
    setOptions(fields, optionName, value) {
      fields = new Set(fields);

      // 递归遍历控件树
      const traverse = array => {
        array.forEach(element => {
          if (fields.has(element.model)) {
            element.options[optionName] = value;
          }
          if (element.type === "grid") {
            // 栅格布局
            element.columns.forEach(item => {
              traverse(item.list);
            });
          } else if (element.type === "card") {
            // 卡片布局
            traverse(element.list);
          } else if (element.type === "batch") {
            // 动态表格
            traverse(element.list);
          }
          if (element.type === "table") {
            // 表格布局
            element.trs.forEach(item => {
              item.tds.forEach(val => {
                traverse(val.list);
              });
            });
          }
        });
      };
      traverse(this.value.list);
    },
    // 隐藏表单字段
    hide(fields) {
      this.setOptions(fields, "hidden", true);
    },
    // 显示表单字段
    show(fields) {
      this.setOptions(fields, "hidden", false);
    },
    // 禁用表单字段
    disable(fields) {
      this.setOptions(fields, "disabled", true);
    },
    // 启用表单字段
    enable(fields) {
      this.setOptions(fields, "disabled", false);
    },
    handleChange(value, key) {
      this.$emit("change", value, key);
      this.combineChange(value,key)
    },
    combineChange(value,key){
      let kv = key+'=='+value
      if(this.value.desc.hasOwnProperty(key)&&this.value.desc[key].combineHandle){ //如果点击的这个组件是可联动操作的
        this.value.list.forEach(item=>{
          if(item.hasOwnProperty('combine_item')&&item['combine_item'].includes(kv)){
            item.options.hidden = false
          }else if(item.is_combine){
            item.options.hidden = true
          }
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setData(this.defaultValue);
      this.getDynamicData()
    });
  }
};
</script>
<style scoped>
  form /deep/ .ant-form-item{
    margin-bottom: 12px;
    font-size:12px;
    font-weight: normal;
  }
  form /deep/ .ant-form label{
    font-size:12px
  }
</style>

