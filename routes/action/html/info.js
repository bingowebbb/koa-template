/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 提示或者报错的页面
 * Last modified: 2018-07-08 10:36
******************************************************************************/

let path  = require('path')
,   agent = require('koa-useragent')
,   RFile = require(path.join(APP_BASE.S, 'dhtml/sendFile'))
;

// eslint-disable-next-line
module.exports = async function(info, ctx, next) {
  await agent(ctx, async function(){
  });
  let mfile;
  let ua = ctx.userAgent;
  if(ua.isDesktop){
    mfile = path.join('/web/info');
  } else {
    mfile = path.join('/mb/info');
  }
  return await RFile({dir: mfile}, ctx, {
    faile: function(){ return Promise.resolve(info);}
  }, next);
};
