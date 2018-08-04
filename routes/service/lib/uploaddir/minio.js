/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 用minio存储文件夹
 * Last modified: 2017-12-21 03:00
******************************************************************************/

var path = require('path')
,   debug= require('debug')('lib:uploaddir:minio')
,   AUDir= require(path.join(APP_BASE.S, 'db/minio/apis/uploadDirectory'))
;

const BUCKET = require('config').get('sys.param.minio.areffect-bucket'); //s3的存储相关

module.exports = function(inDir, storage, next, item){
  AUDir(storage.dbN || null, BUCKET, path.join(item.storagePath, ''), inDir, function(errors){
    errors && debug('Error---:', errors);
    next(errors);
  });
};
