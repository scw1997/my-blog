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
                        link:'/html-css/css-var'
                    },
                    {
                        text:'BFC块级格式化上下文',
                        link:'/html-css/bfc'
                    },
                    {
                        text:'文档流 & 元素类型',
                        link:'/html-css/doc-flow'
                    },
                    {
                        text:'CSS选择器优先级',
                        link:'/html-css/selector-priority'
                    },
                    {
                        text:'伪类 & 伪元素',
                        link:'/html-css/fake'
                    },
                    {
                        text:'移动端适配',
                        link:'/html-css/fit'
                    },
                    {
                        text:'HTML/CSS零碎',
                        link:'/html-css/fragment'
                    }
                ]

            },
            {
                text:'JavaScript',
                collapsed: true,
                items:[
                    {
                        text:'Iterator & Generator',
                        link:'/js/generator'
                    },
                    {
                        text:'原型链',
                        link:'/js/prototype'
                    },
                    {
                        text:'JS类型检测',
                        link:'/js/type-check'
                    },
                    {
                        text:'JS This绑定机制',
                        link:'/js/this-bind'
                    },
                    {
                        text:'JS事件循环机制',
                        link:'/js/event-loop'
                    },
                    {
                        text:'JS手写实现',
                        link:'/js/hand'
                    },
                    {
                        text:'JS零碎',
                        link:'/js/fragment'
                    },

                ]
            },
            {
                text:'React',
                collapsed: true,
                items:[
                    {
                        text:'深入React Hooks',
                        link:'/react/react-hooks'
                    }
                ]
            },
            {
                text:'Vue',
                collapsed: true,
                items:[]
            }
        ]
    },
    {
        text:'生态',
        items:[
            {
                text:'Node.js',
                link:'/node'
            },
            {
                text:'TypeScript',
                link:'/typescript'
            },
            {
                text:'前端工程化',
                link:'/engine'
            },
            {
                text:'微信小程序',
                link:'/mini'
            }
        ]
    },
    {
        text:'进阶',
        items:[
            {
                text:'原理',
                collapsed: true,
                items:[
                    {
                        text:'浏览器渲染机制',
                        link:'/principle/browser-render'
                    },
                    {
                        text:'浏览器缓存机制',
                        link:'/principle/browser-cache'
                    },
                    {
                        text:'HTTP协议',
                        link:'/principle/http'
                    },
                    {
                        text:'Cookie & Session & Token',
                        link:'/principle/cookie-session'
                    },
                    {
                        text:' 浏览器跨域',
                        link:'/principle/cross-origin'
                    },
                    {
                        text:'前端安全攻防',
                        link:'/principle/safety'
                    },
                ]
            },
            {
                text:'数据结构和算法',
                link:'/algorithm'
            },
            {
                text:'设计模式',
                link:'/design-mode'
            },
            {
                text:'零碎',
                link:'/fragment'
            },

        ]
    }
]

export default routes
