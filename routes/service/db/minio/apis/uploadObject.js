/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 上传一个文件到指定目录
 * Last modified: 2018-07-19 03:09
******************************************************************************/

var path = require('path')
,   _    = require('lodash')
,   Cliet= require('../client')
,   GetEt= require(path.join(APP_BASE.S, 'lib/getExt'))
,   debug= require('debug')('db:minio:apis:fPutObject')
,	dbCnf= require('config').get('db.minio')
,	Minio = require('minio')
,	uuid = require('node-uuid');


const minioClient = new Minio.Client({
    'port'  : parseInt(dbCnf['default'].port) || 9000,
    'secure': ~~dbCnf['default'].secure ? true : false,
    'region': dbCnf['default'].region || '',
    'endPoint' : dbCnf['default'].endpoint,
    'accessKey': dbCnf['default'].accessKey,
    'secretKey': dbCnf['default'].secretKey
});


module.exports = function(bucket, folder, file, type){
	return new Promise(function(resolve, reject){
	 	let filePath = path.join(APP_BASE.P, 'upload') + `/${file.name}`;
	  	let b = new Date().getTime().toString() + '/';
	  	let uid = uuid.v1();
	  	let metaData = {};
	  	if(type === "video"){
	  		metaData = {
	  			"Content-type": "video/mp4"
	  		}
	  	}
	  	console.log('metaData:', metaData);
  		return setTimeout(() => {
	  		minioClient.fPutObject(bucket, folder + uid, filePath, metaData, function(err, etag) {
		      if(err) {
		        return reject(err);
		      }
		      console.log(etag);
		      return resolve(uid);
		    });
	  	}, 2000);
	});
};
