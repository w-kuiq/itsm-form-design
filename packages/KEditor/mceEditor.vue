<template>
  <div class="tinymce-editor">
    <!-- <textarea :id="tinymceId" class="tinymce-textarea" /> -->
    <editor
      v-model="myValue"
      :init="init"
      :value="value"
      :disabled="record.options.disabled || parentDisabled"
      @onClick="onClick"
    >
    </editor>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/paste";
import "tinymce/icons/default/icons";
import toolbar from "./toolbar.js";
import plugins from "./plugins.js";

export default {
  name: "KEditor",
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    record: {
      type: Object,
      default: () => ({})
    },
    parentDisabled: {
      type: Boolean,
      default: false
    },

    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: "lists image media table textcolor wordcount contextmenu paste"
    },
    toolbar: {
      type: [String, Array],
      default:
        "undo redo  |  formatselect | bold italic forecolor backcolor| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat"
    }
  },
  data() {
    return {
      init: {
        language_url: `${this.baseUrl}/static/tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `${this.baseUrl}/static/tinymce/skins/ui/oxide`,
        content_css: `${this.baseUrl}/static/tinymce/skins/content/default/content.css`,
        // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
        // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
        height: 300,
        plugins: plugins,
        toolbar: toolbar,
        branding: false,
        menubar: true,
        convert_urls: false,
        fontsize_formats:
          "6px 8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 36px 48px 72px",
        object_resizing: true,
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif,Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
        end_container_on_empty_block: true,
        powerpaste_word_import: "merge",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "default,circle,disc,square",
        advlist_number_styles:
          "default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: this.default_link_target,
        link_title: false,
        link_context_toolbar: true,
        paste_data_images: true,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        // images_upload_handler: (blobInfo, success, failure) => {
        //   const img = "data:image/jpeg;base64," + blobInfo.base64();
        //   success(img);
        // }
        // images_upload_url: "/image/upload",
        images_upload_credentials: true,
        images_upload_handler: function(blobInfo, success, failure) {
          var xhr, formData;
          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open("POST", "/itsm/api/v1/itsm/ticket/upload2");

          // xhr.upload.onprogress = function(e) {
          //   progress((e.loaded / e.total) * 100);
          // };

          xhr.onload = function() {
            var json;

            if (xhr.status < 200 || xhr.status >= 300) {
              failure("HTTP Error: " + xhr.status);
              return;
            }

            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.data.url != "string") {
              failure("Invalid JSON: " + xhr.responseText);
              return;
            }

            success(json.data.url);
          };

          xhr.onerror = function() {
            failure(
              "Image upload failed due to a XHR Transport error. Code: " +
                xhr.status
            );
          };

          formData = new FormData();
          formData.append("file", blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        }
      },
      myValue: this.value
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("change", newValue);
      this.$emit("input", newValue);
    }
  }
};
</script>
