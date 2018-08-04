/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- mongodb的连接
 * Last modified: 2018-07-14 10:32
******************************************************************************/
let _   = require('lodash')
,   mongoose = require('mongoose')
,   dbs = require('config').get('db.mongodb')
;

let stroeDB = {};
module.exports = function(dbN){
  if(_.isEmpty(dbN)) {
    dbN = 'default'; 
  }
  return new Promise(function(resolve, reject){
    if(stroeDB[dbN] && stroeDB[dbN]._OK_){
      return resolve(stroeDB[dbN]);
    }
    stroeDB[dbN] = {};
    let uri = _.get(dbs, [dbN, 'url'].join('.'));
    let opt = _.get(dbs, [dbN, 'opt'].join('.')); 
    if(!uri){
      return reject([{errcode: '14001'}, {field: dbN}]);
    }
    stroeDB[dbN] = mongoose.createConnection(uri, opt);
    stroeDB[dbN]._OK_ = true;
    return resolve(stroeDB[dbN]);
  });
};
