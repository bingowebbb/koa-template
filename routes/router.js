/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 路由服务
 * Last modified: 2018-07-07 19:27
******************************************************************************/
let path = require('path')
,   Async= require('async')
,   _    = require('lodash')
,   Route= require('koa-router')
,   RtCfg= require('config').get('sys.route')
,   Rload= require(path.join(APP_BASE.S, 'load'))
,   sessn= require(path.join(APP_BASE.S, 'session'))
,   hrout= require(path.join(APP_BASE.A, 'router'))
,   RAuth= require(path.join(APP_BASE.A, 'auth/web'))
,   upcfg= require('config').get('sys.param.upload')
,   upload = require('koa-multer')({dest: upcfg.dir, preservePath: true})
;

module.exports = function(app, next){
  Async.waterfall([
    function(cb){
      sessn(app, cb);
    }
  ], function(){
    let route = new Route();
    route.use(upload.single(upcfg.fieldname));
    _.forEach(RtCfg, function(v){
      switch(v.type){
        case 'middle': {
          route.use(v.path, require(path.join(APP_BASE.A, v.action)));
          break;
        }
      }
    });
    // eslint-disable-next-line
    route.all('*\.do', async function(ctx, next){
      var Action = Rload.Aload(ctx.path);
      if( !_.isFunction(Action) ){
        ctx.body = {errcode: 1, errMsg: '访问接口 ' + ctx.path+ ' 未找到!'};
      } else {
        let user = await RAuth(ctx);
        await Action(user, ctx);
      }
    });
    app.use(route.routes());
    hrout(app);
    next(null);
  });
};
