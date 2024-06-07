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
                collapsed: false,
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
                        text:'HTML/CSS零碎',
                        link:'/html-css/fragment'
                    }
                ]

            },
            {
                text:'JavaScript',
                items:[]
            },
            {
                text:'React',
                items:[]
            },
            {
                text:'Vue',
                items:[]
            }
        ]
    },
    {
        text:'进阶',
        items:[
            {
                text:'Node.js',
                items:[]
            },
            {
                text:'Webpack',
                items:[]
            },
            {
                text:'TypeScript',
                items:[]
            },
            {
                text:'小程序',
                items:[]
            }
        ]
    },
    {
        text:'其他',
        items:[
            {
                text:'原理',
                collapsed: false,
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
                        link:'/principle/cookie_session'
                    },
                ]
            },
            {
                text:'算法',
                items:[]
            },
            {
                text:'零碎',
                link:'/principle/fragment'
            },

        ]
    }
]

export default routes
