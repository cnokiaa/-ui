var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
 //   devtool: 'source-map',//由于打包后的代码是合并以后的代码，不利于排错和定位，只需要在config中添加，这样出错以后就会采用source-map的形式直接显示你出错代码的位置。
    //noParse:[/jquery/],//表示跳过jquery,不对其进行编译,这样可以提高打包的速度
    entry: {
        app: "./js/wp/addBankCard_test.js",
        vendor:[
            './js/libs/flexible',
            './js/libs/zepto.min',
           // './js/libs/class',
            './js/libs/touch',
           /* './js/libs/fx',
            './js/libs/fx_methods'*/
            ],  //将常用的打包成一个js
    },
    output: {
        path: __dirname,
        filename: "./js/wp/addBankCard_w.js"
    },
    module: {
        loaders: [
           //{ test: /\.css$/, loader: "style!css" }
           //.css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            //.js 文件使用 jsx-loader 来编译处理
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
           // { test: /\.scss$/, loader: 'style!css!autoprefixer-loader?browsers=last 2 versions!sass'},
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
        ]
    },
    //其它解决方案配置
    resolve: {
       // root: 'D:/ui20160817/ui/wap/tinihuang2/js', //绝对路径
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            flexible : '../libs/flexible.js',
            zepto : "../libs/zepto.min",
            underscore : "../libs/underscore-min",
            touch : "../libs/touch",
            fx : "../libs/fx",
            fx_methods : "../libs/fx_methods",
            Class : "../libs/class",
            utils : "../utils",
            IScroll : "../libs/iscroll-lite",
            doT : "../libs/doT.min",
            bcss : "../../css/addBankCard.css"
        }
    },
    externals:{
        zepto: 'window.$',   //全局定义$
    },
    plugins: [
        //打包常用js
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"./js/wp/vendor.bundle.js"),
    ]
};