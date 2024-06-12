import Layout from './Layout.vue'
import DefaultTheme from 'vitepress/theme'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app, router, siteData }) {
        // ...
    }
}
