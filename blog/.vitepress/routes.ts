
const routes =  [
    {
        text:'简介',
        link:'/'
    },

    {
        text:'核心',
        items:[
            {
                text:'HTML/CSS',
                collapsed: true,
                items:[

                    {
                        text:'CSS变量',
                        link:'/core/html-css/css-var'
                    },
                    {
                        text:'BFC块级格式化上下文',
                        link:'/core/html-css/bfc'
                    },
                    {
                        text:'文档流 & 元素类型',
                        link:'/core/html-css/doc-flow'
                    },
                    {
                        text:'CSS选择器优先级',
                        link:'/core/html-css/selector-priority'
                    },
                    {
                        text:'伪类 & 伪元素',
                        link:'/core/html-css/fake'
                    },
                    {
                        text:'移动端适配',
                        link:'/core/html-css/fit'
                    },
                    {
                        text:'HTML/CSS零碎',
                        link:'/core/html-css/fragment'
                    }
                ]

            },
            {
                text:'JavaScript',
                collapsed: true,
                items:[
                    {
                        text:'Iterator & Generator',
                        link:'/core/js/generator'
                    },
                    {
                        text:'原型链',
                        link:'/core/js/prototype'
                    },
                    {
                        text:'JS类型检测',
                        link:'/core/js/type-check'
                    },
                    {
                        text:'JS This绑定机制',
                        link:'/core/js/this-bind'
                    },
                    {
                        text:'JS事件循环机制',
                        link:'/core/js/event-loop'
                    },
                    {
                        text:'JS手写实现',
                        link:'/core/js/hand'
                    },
                    {
                        text:'JS零碎',
                        link:'/core/js/fragment'
                    },

                ]
            },
            {
                text:'React',
                collapsed: true,
                items:[
                    {
                        text:'React Class组件',
                        link:'/core/react/react-class'
                    },
                    {
                        text:'深入React Hooks',
                        link:'/core/react/react-hooks'
                    },
                    {
                        text:'React 原理',
                        link:'/core/react/react-principle'
                    },
                    {
                        text:'React 架构',
                        link:'/core/react/react-architecture'
                    },
                    {
                        text:'React 零碎',
                        link:'/core/react/fragment'
                    },

                ]
            },
            {
                text:'Vue',
                collapsed: true,
                items:[
                    {
                        text:'Vue 原理',
                        link:'/core/vue/vue-principle'
                    },
                    {
                        text:'Vue 零碎',
                        link:'/core/vue/fragment'
                    },
                ]
            }
        ]
    },
    {
        text:'生态',
        items:[
            {
                text:'Node.js',
                link:'/ecology/node'
            },
            {
                text:'TypeScript',
                link:'/ecology/typescript'
            },
            {
                text:'前端工程化',
                link:'/ecology/engine'
            },
            {
                text:'微信小程序',
                link:'/ecology/mini'
            }
        ]
    },
    {
        text:'进阶',
        items:[

            {
                text:'浏览器渲染机制',
                link:'/advance/browser-render'
            },
            {
                text:'浏览器缓存机制',
                link:'/advance/browser-cache'
            },
            {
                text:'HTTP协议',
                link:'/advance/http'
            },
            {
                text:'Cookie & Session & Token',
                link:'/advance/cookie-session'
            },
            {
                text:' 浏览器跨域',
                link:'/advance/cross-origin'
            },
            {
                text:'前端安全攻防',
                link:'/advance/safety'
            },

            {
                text:'数据结构和算法',
                link:'/advance/algorithm'
            },
            {
                text:'设计模式',
                link:'/advance/design-mode'
            },


        ],
    },
    {
        text: '后端',
        items:[
            {
                text:'Java',
                collapsed: true,
                items: [
                    {
                        text:'Java基础',
                        link: '/java/java-basic'
                    }
                ]
            }
        ]
    },
    {
        text: '其他',
        link:'/others'
    },
    {
        text: '常用工具类/函数',
        link:'/tools'
    },
    ...(process.env.NODE_ENV === 'dev' ?[   {
        text: '测试题',
        link:'/test'
    }]:[])


]

export default routes
