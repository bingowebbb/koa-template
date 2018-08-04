/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 内部访问的接口
 * Last modified: 2018-07-08 14:15
******************************************************************************/
let path = require('path')
,   _    = require('lodash')
,   debug= require('debug')('A:inner')
,   route= new (require('koa-router'))()
,   urls = require('config').get('sys.innerurl')
,   RAuth= require(path.join(APP_BASE.A, 'auth/web'))
;
const Actions = {};
Object.keys(urls).forEach(function(v){
  Object.defineProperty(Actions, v, { get: function(){ return require(urls[v]); }});
});

route.all('/', async function(ctx){
  ctx.request.body = _.merge(ctx.request.body, ctx.req.body);
  let ent = _.get(ctx, 'query.entity')    || _.get(ctx, 'request.body.entity')
  ,   _t  = _.get(ctx, 'query.eventType') || _.get(ctx, 'request.body.eventType')
  ;
  debug('---body--', ctx.request.body);
  debug('--eventType:--', _t);
  debug('--entity:--', ent);
  ctx.type = 'json';
  ctx.body = await module.run(_t, ent, ctx);
});

module.run = async function(_t, ent, ctx){
  if(!_.isFunction(Actions[_t])){
    return ctx.errFn({errcode: 40011});
  }
  try {
    let user = await RAuth(ctx);
    let json = JSON.parse(ent);
    try {
      return {
        errcode: 0,
        data : await Actions[_t](json, ctx, user)
      };
    } catch(e){
      console.log('----e---:', e);
      return ctx.errFn(e);
    }
  } catch(e) {
    if(_.get(e, 'errcode') || _.get(e, '0.errcode')){
      return ctx.errFn(e);
    }
    return ctx.errFn({errcode: 40021});
  }
};
module.exports = route.routes();
