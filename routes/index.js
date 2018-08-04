/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 入口
 * Last modified: 2018-07-07 19:22
******************************************************************************/
var path = require('path')
,   route= require('./router')
,   queue= require(path.join(APP_BASE.S, 'queue'))
;

module.exports = function(app, next){
  queue.call(app);
  route(app, function(){
    next(null);
  });
};
