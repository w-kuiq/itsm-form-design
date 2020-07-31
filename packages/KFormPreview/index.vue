<template>
  <a-modal
    title="预览"
    :visible="visible"
    @ok="handleGetData"
    @cancel="handleCancel"
    okText="获取数据"
    cancelText="关闭"
    style="top:20px;"
    :destroyOnClose="true"
    :width="`${previewWidth}px`"
  >
    <k-form-build 
      :value="jsonData"
      @submit="handleSubmit"
      :dynamicData="dynamicData"
      ref="KFormBuild"
    />
    <jsonModel ref="jsonModel" />
  </a-modal>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 */
import jsonModel from "../KFormDesign/module/jsonModal";
import axios from "axios";

export default {
  name: "KFormPreview",
  data() {
    return {
      visible: false,
      previewWidth: 850,
      jsonData: {},
      dynamicData:{}
    };
  },
  components: {
    jsonModel
  },
  methods: {
    handleSubmit(p) {
      p.then(res => {
        console.log(res, "获取数据成功");
        this.$refs.jsonModel.jsonData = res;
        this.$refs.jsonModel.visible = true;
      }).catch(err => {
        console.log(err, "获取数据失败");
      });
    },
    handleGetData() {
      this.$refs.KFormBuild.getData()
        .then(res => {
          console.log(res, "获取数据成功");
          this.$refs.jsonModel.jsonData = res;
          this.$refs.jsonModel.visible = true;
        })
        .catch(err => {
          console.log(err, "获取数据失败");
        });
    },
    handleCancel() {
      this.visible = false;
    },
    handleDynamic() {
      console.log(this.dynamicData)
    },
    dynamicDataInit() {
      this.$nextTick(function() {
        // this.$refs.KFormBuild.getDynamicData();
      });
    }
    // dynamicDataInit() {
    //   // this.$refs.KFormBuild.getDynamicData();
    //   //遍历jsonData的list;找到需要异步加载的字段；
    //   let desc = this.jsonData.desc;
    //   let KeyArr = Object.keys(desc);
    //   let _this = this;
    //   KeyArr.forEach(function(item) {
    //     // eslint-disable-next-line no-prototype-builtins
    //     if (desc[item].hasOwnProperty("dynamicKey")) {
    //       _this.getAsyncData(
    //         desc[item].dynamicUrl,
    //         desc[item].dynamicKey,
    //         desc[item].dynamicParam
    //       );
    //     }
    //   });
    // },
    // getAsyncData(url, key, param) {
    //   axios
    //     .get(url)
    //     .then(res => {
    //       if (res.status == 200) {
    //         this.$set(this.dynamicData, key, res.data[param]);
    //       }
    //     })
    //     .catch(err => {
    //       this.$message.error(err);
    //     });
    // }
  }
};
</script>
