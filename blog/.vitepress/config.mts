import { defineConfig } from 'vitepress'
import getRoutes from "./routes.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "fanlaBoy随记册",
  base:'/my-blog/',
  lang:'zh-cn',
  markdown: {
    image: {
      // 图片懒加载
      lazyLoading: true
    }
  },
  head:   [['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/my-blog/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: getRoutes('nav'),

    sidebar:  getRoutes('side'),
    search: {
      provider: 'local',
      options: {

        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }

      }
    },
    outline:{
      label:'页面导航',
    },
    sidebarMenuLabel:"菜单",
    docFooter:{
      prev:'上一页',
      next:'下一页'
    },
    lastUpdated: {
      text: '最后更新于'
    },
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2024-present'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/scw1997/my-blog.git' }
    ]
  }
})
