<!--
 * @Author: wangkq
 * @Date: 2020-07-20 16:32:18
 * @LastEditTime: 2020-07-22 18:19:49
 * @LastEditors: wangkq
 * @Description: 
--> 
<!--
 * @Author: wangkq
 * @Date: 2020-06-19 11:04:43
 * @LastEditTime: 2020-07-16 15:45:07
 * @LastEditors: wangkq
 * @Description: 
--> 
<template>
  <div>
    <a-select
      show-search
      :value="value"
      :placeholder="record.options.placeholder"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :disabled='disabled'
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
import axios from 'axios';
export default {
  name: 'selectSearch',
  data(){
    return{
      data:[]
    }
  },
  props: ['record', 'value','disabled','dynamicData'],
  // props: {
  //   record: {
  //     type: Object,
  //     require: true
  //   },
  //   value: {
  //     type: String,
  //     default: ''
  //   }
  // },
  methods: {
    handleChange (e) {
      // 使用 onChange 事件修改值
      this.$emit('change', e)
    },
    handleSearch(value) {
      // this.request(this.record.options.dynamicUrl+value).then(res=>{
      //   this.data = res
      // })
      axios
        .get(this.record.options.dynamicUrl+value)
        .then(res => {
          if (res.status == 200) {
           this.data = res.data[this.record.options.dynamicParam];
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
  
  },
  mounted () {
    // 打印接收的options
    window.$$ = this
  }
}
</script>