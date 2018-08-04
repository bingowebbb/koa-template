/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 调取umai社区的api方法
 * Last modified: 2018-07-10 21:09
******************************************************************************/
let debug= require('debug')('S:lib:umai:api')
;
const IDF = require('config').get('sys.apicf.umai');

module.exports = function(type, data, pathOpt){
  return new Promise(function(resolve, reject){
    IDF.request(type, data, function(err, rsq, body){
      if(err){
        debug(err);
        return reject(err);
      }
      return resolve(body);
    }, pathOpt);
  });
};
