/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 用户登陆，采用ldap的方式
 * Last modified: 2018-07-09 18:07
******************************************************************************/

let _        = require('lodash')
,   passport = require('koa-passport')
;

module.exports = function(user, ctx, next){
  // ldap需要用body去读取变量
  ctx.body = ctx.request.body;
  return passport.authenticate('ldapauth', {session: false}, async function(err, user){
    if(err || !user){
      ctx.body = {
        errcode: 401, errmsg: '用户名或密码错误'
      };
    } else {
      let _user = {
        'login' : _.get(user, 'cn'),
        'mail'  : _.get(user, 'mail'),
        'mobile': _.get(user, 'mobile'),
        'name'  : _.get(user, 'displayName')
      };
      passport.serializeUser(function(user, done) {
        done(null, JSON.stringify(user));
      });
      await ctx.login(_user);
      ctx.redirect('/index.html');
    }
  })(ctx, next);
};
