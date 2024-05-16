import { defineConfig } from 'vitepress'
import {routes} from "./cache/routes";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "fanlaBoy随记册",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: routes,

    sidebar: routes,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/scw1997/my-blog.git' }
    ]
  }
})
