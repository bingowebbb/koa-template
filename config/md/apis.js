/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 访问外面的api配置
 * Last modified: 2018-07-10 21:17
******************************************************************************/
let path = require('path')
,   fs   = require('fs')
,   _    = require('lodash')
,   APIS = {}
;
_.forEach(fs.readdirSync(path.join(__dirname, 'apis')), function(v){
  if(!/^\./.test(v)){
    APIS[path.basename(v, path.extname(v))] = require(path.join(__dirname, 'apis', v));
  }
});
module.exports = APIS;
