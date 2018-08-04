/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 上传一个文件到指定目录
 * Last modified: 2017-12-19 03:09
******************************************************************************/

var path = require('path')
,   _    = require('lodash')
,   Cliet= require('../client')
,   GetEt= require(path.join(APP_BASE.S, 'lib/getExt'))
,   debug= require('debug')('db:minio:apis:fPutObject')
;

module.exports = function(dbN, bucketName, objectName, filePath, next){
  if(arguments.length == 4 && _.isFunction(filePath)){
    next = filePath; filePath = objectName; objectName = bucketName; bucketName = dbN; dbN = null;
  }
  Cliet(dbN, function(error, Client){
    Client.fPutObject(bucketName, objectName, filePath, GetEt(filePath)['mime'], function(error, etag){
      error && debug('fPutObject Error 【',error,'】, 文件名：', filePath);
      next(error, etag);
    });
  });
};

