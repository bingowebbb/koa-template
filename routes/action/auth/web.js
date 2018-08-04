/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: --  web 页面的登陆认证
 * Last modified: 2018-07-08 09:56
******************************************************************************/
let _    = require('lodash')
,   debug= require('debug')('A:auth:web')
,   nAuth= require('config').get('sys.param.web_end.no-login')
;

module.exports = async function(ctx){
  // 不需要认证
  debug('--inAuth-: ');
  if(_.indexOf(nAuth, ctx.path) != -1){
    return;
  }
  return {}; // 跳过登录
  debug('---isAuth: ', ctx.isAuthenticated());
  if(ctx.isAuthenticated()){
    let user = ctx.state.user;
    debug('--user: ', user);
    if(_.get(user, 'login')){ 
      return user;
    }
  }
  if( ctx.accepts('json', 'html') == 'json'){
    return Promise.reject({errcode: '401'});
  }
  ctx.redirect('/login');
  ctx.status = 302;
  return Promise.reject({errcode: '3001'});
};
