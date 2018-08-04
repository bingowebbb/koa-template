/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: --  上传自定文件夹
 * Last modified: 2017-12-19 03:14
******************************************************************************/

var path = require('path')
,   Async= require('async')
,   _    = require('lodash')
,   Cliet= require('../client')
,   recursive = require('recursive-readdir')
,   GetEt= require(path.join(APP_BASE.S, 'lib/getExt'))
,   debug= require('debug')('db:minio:apis:uploadDirectory')
;

module.exports = function(dbN, bucketName, objectName, fromDir, next){
  if(arguments.length == 4 && _.isFunction(fromDir)){
    next = fromDir; fromDir = objectName; objectName = bucketName; bucketName = dbN; dbN = null;
  }
  Cliet(dbN, function(error, Client){
    recursive(fromDir, function(err, files){
      Async.eachLimit(files, 2, function(filePath, cb){
        let filename = filePath.replace(fromDir, '');
        Client.fPutObject(bucketName, path.join(objectName, filename), filePath, GetEt(filePath)['mime'], function(error, etag){
          error && debug('Error 【',error,'】, 文件名：', filePath);
          cb(error, etag);
        });
      }, function(err){
        next(err);
      });
    });
  });
};
