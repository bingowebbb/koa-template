/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 获取一个object数据
 * Last modified: 2017-12-18 18:42
******************************************************************************/

var _    = require('lodash')
,   Cliet= require('../client')
;

module.exports = function(dbN, bucketName, objectName, next){
  if(arguments.length == 3 && _.isFunction(objectName)){
    next = objectName; objectName = bucketName; bucketName = dbN; dbN = null;
  }
  Cliet(dbN, function(error, Client){
    Client.getObject(bucketName, objectName, next);
  });
};
