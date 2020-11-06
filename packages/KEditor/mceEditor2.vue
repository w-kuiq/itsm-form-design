<template>
  <div class="tinymce-container" :style="{ width: containerWidth }">
    <!-- <textarea :id="tinymceId" class="tinymce-textarea" /> -->
    <!-- 插件：插入文件和图片 -->
    <editor
      v-model="myValue"
      :init="inits"
      :value="value"
      :disabled="record.options.disabled || parentDisabled"
      @onClick="onClick"
    >
    </editor>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";
import Editor from "@tinymce/tinymce-vue";

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce@5.4.2/tinymce.min.js'
const tinymceLoc = "/static/tinymce/tinymce.min.js";

export default {
  name: "Tinymce",
  components: {
    Editor
  },
  props: {
    id: {
      type: String,
      default: function() {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      }
    },
    record: {
      type: Object,
      default: () => ({})
    },
    parentDisabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      type: Boolean,
      default: true
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto"
    },
    readonly: {
      type: Boolean,
      default: false
    },
    links: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      hasChange: false,
      uploadVisible: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja"
      },
      default_link_target: "_self",
      myValue: this.value,
      inits: {
        language_url: `/static/tinymce/langs/zh_CN.js`,
        language: "zh_CN",
        skin_url: `/static/tinymce/skins/ui/oxide`,
        content_css: `/static/tinymce/skins/content/default/content.css`,

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
      }
    };
  },
  computed: {
    language() {
      return this.languageTypeList["zh"];
    },
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    },
    maxHeight() {
      return document.body.clientHeight - 240;
    }
  },
  watch: {
    value(val) {
      this.myValue = val;
      if (!this.hasChange && this.uploadVisible) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || "")
        );
      }
    },
    language() {
      this.destroyTinymce();
      this.$nextTick(() => this.initTinymce());
    },

    myValue(newValue) {
      this.$emit("change", newValue);
      this.$emit("input", newValue);
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    init() {
      // dynamic load tinymce from local
      load(tinymceLoc, err => {
        if (err) {
          this.$message.error(err.message);
          return;
        }
        // this.initTinymce()
      });
    },
    initTinymce() {
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.language,
        height: this.height,
        min_height: 200,
        max_height: this.maxHeight,
        body_class: "panel-body ",
        object_resizing: true,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif,Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
        fontsize_formats:
          "6px 8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 36px 48px 72px",
        end_container_on_empty_block: true,
        powerpaste_word_import: "merge",
        paste_data_images: true,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "default,circle,disc,square",
        advlist_number_styles:
          "default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: this.default_link_target,
        link_title: false,
        link_context_toolbar: true,
        link_list: this.links,
        readonly: this.readonly,
        placeholder: this.placeholder,
        // autoresize
        /* autoresize_on_init: false,
        autoresize_min_height: 350,
        autoresize_bottom_margin: 1,
        toolbar_sticky: true, */
        indentation: "10px", // 缩进
        indent2em: "2em", // 缩进
        toc_depth: 9,
        toc_class: "mce-toc",
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        statusbar: true, // 显示/隐藏底部状态栏
        branding: false,
        // codesample
        // markup+css+clike+javascript+bash+docker+go+java+json+markdown+nginx+python+regex+sql+toml+yaml
        codesample_languages: [
          { text: "CSS", value: "css" },
          { text: "Docker", value: "docker" },
          { text: "Go", value: "go" },
          { text: "HTML/XML", value: "markup" },
          { text: "Java", value: "java" },
          { text: "JavaScript", value: "javascript" },
          { text: "JSON", value: "json" },
          { text: "Markdown", value: "markdown" },
          { text: "Nginx", value: "nginx" },
          { text: "PHP", value: "php" },
          { text: "Python", value: "python" },
          { text: "Regex", value: "regex" },
          { text: "Shell", value: "bash" },
          { text: "SQL", value: "sql" },
          { text: "TOML", value: "toml" },
          { text: "YAML", value: "yaml" }
        ],
        init_instance_callback: editor => {
          if (this.value) {
            editor.setContent(this.value);
          }
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit(
              "input",
              editor.getContent(),
              editor.getContent({ format: "text" })
            );
          });
        },
        setup: editor => {
          editor.on("FullscreenStateChanged", e => {
            this.fullscreen = e.state;
          });
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false,
        images_upload_handler: (blobInfo, succFun, failFun) => {
          var xhr, formData;
          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open("POST", "/knowledge/v1/files");
          xhr.onload = () => {
            var json;
            if (xhr.status !== 200) {
              failFun("HTTP Error: " + xhr.status);
              return;
            }
            json = JSON.parse(xhr.responseText);
            if (!json || typeof json.location !== "string") {
              failFun("Invalid JSON: " + xhr.responseText);
              return;
            }
            succFun(json.location);
          };
          formData = new FormData();
          formData.append("file", blobInfo.blob(), blobInfo.filename());
          xhr.send(formData);
        },
        files_upload_handler: () => {
          this.uploadVisible = true;
        }
      });
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    uploadSuccessCBK(arr) {
      arr.forEach(v => {
        window.tinymce
          .get(this.tinymceId)
          .insertContent(
            `<p><a href="${v.url}" target="${this.default_link_target}">${v.name}</a></p>`
          );
      });
    },
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    }
  }
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>

<style lang="less">
.mce-toc {
  margin: -10px 0 10px 0;
  padding: 12px 0 1px 4px;
  line-height: 20px;
  font-size: 12px;
  border: 1px solid #91c89c;
  border-radius: 4px;
  background-color: #f3f9f4;
  h2 {
    display: none;
  }
  ul {
    padding-left: 14px;
    list-style-type: none;
  }
  a {
    color: #606266;
  }
  a:hover {
    color: #409eff;
  }
}
.tox-tinymce-aux {
  z-index: 9999 !important;
}
</style>
