const getRoutes:(type:'side'|'nav')=>any[] =  (type)=> [
    {
        text:'简介',
        link:'/'
    },
    {
        text:'核心',
        items:[
            {
                text:'HTML/CSS',
                ...(type==='side'?{
                    collapsed: false,
                    items:[

                        {
                            text:'CSS变量',
                            link:'/html-css/css-var'
                        },
                        {
                            text:'文档流 & 元素类型',
                            link:'/html-css/doc-flow'
                        },
                        {
                            text:'CSS渲染原理',
                            link:'/html-css/render-principle'
                        },
                        {
                            text:'HTML/CSS零碎笔记',
                            link:'/html-css/fragment'
                        }
                    ]
                }:{ link:'/html-css/css-var'})

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
                text:'网络',
                items:[]
            },
            {
                text:'算法',
                items:[]
            },
        ]
    }
]

export default getRoutes
