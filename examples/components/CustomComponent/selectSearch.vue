<!--
 * @Author: wangkq
 * @Date: 2020-06-19 11:04:43
 * @LastEditTime: 2021-08-19 19:42:14
 * @LastEditors: Please set LastEditors
 * @Description:
-->
<template>
  <div>
    <a-select
      show-search
      mode="multiple"
      :value="value"
      :placeholder="record.options.placeholder"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :disabled="disabled"
      @search="handleSearch"
      @change="handleChange"
    >
      <a-select-option v-for="d in data" :key="d.value">
        {{ d.label }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "SelectSearch",
  // eslint-disable-next-line vue/require-prop-types
  props: ["record", "value", "disabled", "dynamicData", "list"],
  data() {
    return {
      data: [],
      defaultValue: false,
      timer: null
    };
  },
  // // updated() {
  // //   if (!this.defaultValue) {
  // //     this.defaultValue = true
  // //     axios
  // //       .get(this.record.options.dynamicUrl + this.value)
  // //       .then(res => {
  // //         if (res.status === 200) {
  // //           const newArr = res.data[this.record.options.dynamicParam].filter((item) => {
  // //             return item.value === this.value
  // //           })
  // //           // console.log('selectsearch:', newArr)
  // //           // this.value = newArr.length > 0 ? newArr[0].label : ''
  // //         }
  // //       })
  // //       .catch(err => {
  // //         this.$notify({
  // //           title: '错误提示',
  // //           message: err,
  // //           type: 'error',
  // //           duration: 4000
  // //         })
  // //       })
  // //   }
  // },
  // props: {
  //   record: {
  //     type: Object,
  //     required: true
  //   },
  //   value: {
  //     type: String,
  //     default: ''
  //   }
  // },
  methods: {
    handleChange(e) {
      // 使用 onChange 事件修改值
      this.$emit("change", e);
    },
    handleSearch(value) {
      let url = this.record.options.dynamicUrl + value;

      if (window.sessionStorage.getItem("process_instance_id")) {
        const process_instance_id = window.sessionStorage.getItem(
          "process_instance_id"
        );
        url =
          this.record.options.dynamicUrl.split("?")[0] +
          "?process_instance_id=" +
          process_instance_id +
          "&" +
          this.record.options.dynamicUrl.split("?")[1] +
          value;
      }
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        axios
          .get(url)
          .then(res => {
            if (res.status === 200) {
              this.data = res.data[this.record.options.dynamicParam];
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      }, 1000);
    }
  }
};
</script>
