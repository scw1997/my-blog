<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import {Image} from 'ant-design-vue'
import {ref} from "vue";
const { Layout } = DefaultTheme

const previewConfig = ref({
  src: undefined,
  visible: false
});

//处理图片内容的预览效果
const handleContentClick = (e) => {
  const target: HTMLElement = e.target;
  if (target.nodeName === 'IMG') {
    previewConfig.value = {
      visible: true,
      src: e.target.currentSrc
    };
  }
};
</script>


<template>
  <Layout @click="handleContentClick"/>

  <Image
      v-if="previewConfig?.src && previewConfig.visible"
      class="image"
      :preview="{
                visible: previewConfig?.visible,
                src: previewConfig.src,
                onVisibleChange: (value) => {
                    console.log('vake',value)
                    previewConfig = { ...previewConfig, visible: value };
                }
            }"
      :src="previewConfig.src"
      style="display: none"
      :width="200"
  />
</template>



<style scoped>

</style>
