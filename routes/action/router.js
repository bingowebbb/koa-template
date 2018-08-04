 /******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 路由处理
 * Last modified: 2018-07-09 17:51
******************************************************************************/

let path = require('path')
,   _    = require('lodash')
,   route= new (require('koa-router'))()
,   Rload= require(path.join(APP_BASE.S, 'load'))
,   RAuth= require(path.join(APP_BASE.A, 'auth/web'))
;

// eslint-disable-next-line
module.exports = function(app){
  route.get('*', async function(ctx, next){
    try {
      let user = await RAuth(ctx);
      // GET 请求交给html处理，一般都是出页面的
      let Action = Rload.RLoad(__dirname, path.join('html', ctx.path));
      if(_.isFunction(Action)) {
         return await Action(user, ctx, next);
      }
      Action = Rload.RLoad(__dirname, 'html/index');
      try {
        await Action(user, ctx, next);
      } catch(e) {
        await next(null);
      }
    } catch(err) {
      !_.get(err, 'errcode') && await next();
    }
  });
  route.post('*', async function(ctx, next){
    try {
      let user = await RAuth(ctx);
      let Action = Rload.RLoad(__dirname, path.join('method/post', ctx.path));
      _.isFunction(Action) ? await Action(user, ctx, next) : await next(null);
    } catch(err){
      !_.get(err, 'errcode') && await next();
    }
  });
  app.use(route.routes());
  //处理404的
  app.use(async function(ctx, next){
    let Action = Rload.RLoad(__dirname, path.join('html/info'));
    _.isFunction(Action) ? await Action({}, ctx, next) : await next(null);
  });
};
