<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import {Image} from 'ant-design-vue'
import {ref,onMounted,computed} from "vue";
import {Content, useData, useRoute} from 'vitepress'
const data = useData()
const route = useRoute()
const { page } = data
const { Layout } = DefaultTheme

const isYanerPage = computed(()=>route.path==='/my-blog/yaner/')

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
 if(isYanerPage){
   document.title = '燕儿，生日快乐'
 }
});
</script>


<template>
  <Content v-if="isYanerPage"/>
  <Layout @click="handleContentClick" v-if="!isYanerPage"/>

  <Image
      v-if="!isYanerPage && previewConfig?.src && previewConfig.visible"
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
