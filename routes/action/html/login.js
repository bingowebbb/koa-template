/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 登陆界面
 * Last modified: 2018-07-08 10:29
******************************************************************************/
let path = require('path')
,   Hinfo= require(path.join(APP_BASE.A, 'html/info'))
,   RFile= require(path.join(APP_BASE.S, 'dhtml/sendFile'))
;

module.exports = async function(user, ctx, next){
  return await RFile({idf: ctx.query, dir: path.join('web', ctx.path)}, ctx, {
    faile: async function(){
      return Promise.resolve({}); 
    },
    noTpl: async function(){
      return await Hinfo({}, ctx, next);
    }
  });
};
