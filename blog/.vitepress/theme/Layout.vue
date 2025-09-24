<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import {Image} from 'ant-design-vue'
import {ref,onMounted,computed} from "vue";
import {Content, useData} from 'vitepress'
const data = useData()
const { page } = data
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



onMounted(() => {
 if(page?.filePath==='yaner/index.md'){
   document.title='难忘的每一天'
 }
});
</script>


<template>
  <Content v-if="page?.filePath==='yaner/index.md'"/>
  <Layout @click="handleContentClick" v-if="page?.filePath!=='yaner/index.md'"/>

  <Image
      v-if="page?.filePath!=='yaner/index.md' && previewConfig?.src && previewConfig.visible"
      class="image"
      :preview="{
                visible: previewConfig?.visible,
                src: previewConfig.src,
                onVisibleChange: (value) => {
                    // console.log('vake',value)
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
