/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 默认处理，代理所有未定义的
 * Last modified: 2018-07-09 19:15
******************************************************************************/

let path  = require('path')
,   Hinfo = require(path.join(APP_BASE.A, 'html/info'))
,   RFile = require(path.join(APP_BASE.S, 'dhtml/sendFile'))
;

module.exports = async function(User, ctx, next) {
  let  mfile = path.join('/web/', ctx.path == '/' ? 'index' : ctx.path);
  return await RFile({ idf: ctx.query, dir: mfile }, ctx, {
    faile: function(){
      return {};
    },
    noTpl: async function(){
      return await Hinfo({}, ctx, next);
    },
    errFn: async function(){
      return await Hinfo({}, ctx, next);
    }
  }); 
};
