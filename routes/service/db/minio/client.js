/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- minio 客户端初始化
 * Last modified: 2017-12-18 17:49
******************************************************************************/

var Minio= require('minio')
,   _    = require('lodash')
,   debug= require('debug')('db:minio:client')
,   dbCnf= require('config').get('db.minio')
;


module.exports = function(dbN, next){
  if(!_.isString(dbN)){
    dbN = 'default';
  }
  if(!_.has(dbCnf, dbN)){
    debug('No db ',dbN,' paramter config');
  }
  debug('-- dbCnf---', dbCnf[dbN]);
  const Client = new Minio.Client({
    'port'  : parseInt(dbCnf[dbN].port) || 9000,
    'secure': ~~dbCnf[dbN].secure ? true : false,
    'region': dbCnf[dbN].region || '',
    'endPoint' : dbCnf[dbN].endpoint,
    'accessKey': dbCnf[dbN].accessKey,
    'secretKey': dbCnf[dbN].secretKey
  });
  next(null, Client);
};
