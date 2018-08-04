/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 预设置相关环境
 * Last modified: 2018-07-07 17:37
******************************************************************************/
let Koa  = require('koa')
,   cors = require('koa2-cors')
,   path = require('path')
,   Ejs  = require('koa-ejs')
,   run  = require('./routes')
,   stati= require('koa-static-cache')
,   favic= require('koa-favicon')
,   debug= require('debug')('index')
,   logger = require('koa-logger')
,   bodyParser = require('koa-bodyparser')
,   route= new (require('koa-router'))()
,   ErrT = require(path.join(APP_BASE.S, 'lib/errcode'))
,   stext= require('config').get('sys.param.static_ext')
,   koaBody = require('koa-body')
,   app  = new Koa();

app.use(cors({
    origin: function(ctx){
        if(ctx.url === '/test'){
            return false;
        }
        return "*";
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-type', 'Authorization', 'Accept']
}));

app.use(logger());
Ejs(app, {
    root: APP_BASE.V,
    layout: false,
    viewExt: 'ejs',
    cache: true,
    debug: false
});
// favicon输出
app.use(
  favic(path.join(APP_BASE.P, 'favicon.ico'), {
    //10 分钟
    maxAge: 1000 * 60 * 10
  })
);

// 文件上传
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 50000*1024*1024    // 设置上传文件大小最大限制，默认50M
    },
    "formLimit":"50mb",
    "jsonLimit":"5mb",
    "textLimit":"5mb"
}));

// 静态目录
app.use(stati(APP_BASE.P, {
  gzip: true,
  buffer: true,
  dynamic: true,
  usePrecompiledGzip: true,
  maxAge: 365 * 24 * 60 * 60
}));

// 先干掉上面静态没处理掉的，由当前处理了
route.get(stext, function(ctx){
  //后面的路由不要处理跟静态文件相关的东西
  ctx.status = 404;
});
app.context.errFn = ErrT;
app.use(route.routes());
app.use(bodyParser({formLimit: '50mb'}));

run(app, function(){
  app.on('error', err => {
    debug('server error', err);
  });
});

module.exports = app;
