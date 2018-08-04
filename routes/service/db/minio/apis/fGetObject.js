/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 文件的形式获取数据
 * Last modified: 2017-12-18 19:16
******************************************************************************/

var _    = require('lodash')
,   Cliet= require('../client')
;

module.exports = function(dbN, bucketName, objectName, filePath, next){
  if(arguments.length == 4 && _.isFunction(filePath)){
    next = filePath; filePath = objectName; objectName = bucketName; bucketName = dbN; dbN = null;
  }
  Cliet(dbN, function(error, Client){
    Client.fGetObject(bucketName, objectName, filePath, next);
  });
};
