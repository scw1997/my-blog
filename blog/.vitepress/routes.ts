
const routes =  [
    {
        text:'简介',
        link:'/'
    },

    {
        text:'前端',
        items:[
            {
                text:'HTML/CSS',
                collapsed: true,
                items:[

                    {
                        text:'CSS变量',
                        link:'/frontend/html-css/css-var'
                    },
                    {
                        text:'BFC块级格式化上下文',
                        link:'/frontend/html-css/bfc'
                    },
                    {
                        text:'文档流 & 元素类型',
                        link:'/frontend/html-css/doc-flow'
                    },
                    {
                        text:'CSS选择器优先级',
                        link:'/frontend/html-css/selector-priority'
                    },
                    {
                        text:'伪类 & 伪元素',
                        link:'/frontend/html-css/fake'
                    },
                    {
                        text:'移动端适配',
                        link:'/frontend/html-css/fit'
                    },
                    {
                        text:'HTML/CSS零碎',
                        link:'/frontend/html-css/fragment'
                    }
                ]

            },
            {
                text:'JavaScript',
                collapsed: true,
                items:[
                    {
                        text:'Iterator & Generator',
                        link:'/frontend/js/generator'
                    },
                    {
                        text:'原型链',
                        link:'/frontend/js/prototype'
                    },
                    {
                        text:'JS类型检测',
                        link:'/frontend/js/type-check'
                    },
                    {
                        text:'JS This绑定机制',
                        link:'/frontend/js/this-bind'
                    },
                    {
                        text:'JS事件循环机制',
                        link:'/frontend/js/event-loop'
                    },
                    {
                        text:'JS手写实现',
                        link:'/frontend/js/hand'
                    },
                    {
                        text:'JS零碎',
                        link:'/frontend/js/fragment'
                    },

                ]
            },
            {
                text:'React',
                collapsed: true,
                items:[
                    {
                        text:'React Class组件',
                        link:'/frontend/react/react-class'
                    },
                    {
                        text:'深入React Hooks',
                        link:'/frontend/react/react-hooks'
                    },
                    {
                        text:'React 原理',
                        link:'/frontend/react/react-principle'
                    },
                    {
                        text:'React 架构',
                        link:'/frontend/react/react-architecture'
                    },
                    {
                        text:'React 零碎',
                        link:'/frontend/react/fragment'
                    },

                ]
            },
            {
                text:'Vue',
                collapsed: true,
                items:[
                    {
                        text:'Vue 原理',
                        link:'/frontend/vue/vue-principle'
                    },
                    {
                        text:'Vue 零碎',
                        link:'/frontend/vue/fragment'
                    },
                ]
            },
            {
                text:'进阶',
                collapsed: true,
                items:[
                    {
                        text:'HTTP协议',
                        link:'/frontend/advanced/http'
                    },
                    {
                        text:'Cookie & Session & Token',
                        link:'/frontend/advanced/cookie-session'
                    },
                    {
                        text:'浏览器跨域',
                        link:'/frontend/advanced/cross-origin'
                    },
                    {
                        text:'浏览器渲染机制',
                        link:'/frontend/advanced/browser-render'
                    },
                    {
                        text:'浏览器缓存机制',
                        link:'/frontend/advanced/browser-cache'
                    },
                    {
                        text:'前端安全攻防',
                        link:'/frontend/advanced/safety'
                    },

                    {
                        text:'数据结构和算法',
                        link:'/frontend/advanced/algorithm'
                    },
                    {
                        text:'设计模式',
                        link:'/frontend/advanced/design-mode'
                    },
                ]

            },
            {
                text:'Node.js',
                link:'/frontend/node'
            },
            {
                text:'TypeScript',
                link:'/frontend/typescript'
            },
            {
                text:'前端工程化',
                link:'/frontend/engine'
            },
            {
                text:'微信小程序',
                link:'/frontend/weixin-micro'
            },
            {
                text: '常用工具函数',
                link:'/frontend/tools'
            },
            {
                text: '其他',
                link:'/frontend/others'
            },

        ]
    },

    {
        text: '后端',
        items:[
            {
                text: 'Java',
                collapsed: true,
                items:[
                    {
                        text:'Java基础（上）',
                        link: '/backend/java/java-basic-1'
                    },
                    {
                        text:'Java基础（下）',
                        link: '/backend/java/java-basic-2'
                    },
                    {
                        text:'Java Web',
                        link: '/backend/java/java-web'
                    },
                    {
                        text:'常用工具类',
                        link: '/backend/java/tools'
                    },
                ]
            },
            {
                text: '数据库',
                collapsed: true,
                items:[
                    {
                        text:'MySql（上）',
                        link: '/backend/database/mysql-1'
                    },
                    {
                        text:'MySql（下）',
                        link: '/backend/database/mysql-2'
                    },
                    {
                        text:'PostgreSql',
                        link: '/backend/database/postgre-sql'
                    }
                ]
            },
            {
                text: '运维',
                link: '/backend/operation'
             }

        ]
    },


    ...(process.env.NODE_ENV === 'dev' ?[   {
        text: '测试题',
        link:'/test'
    }]:[])


]

export default routes
