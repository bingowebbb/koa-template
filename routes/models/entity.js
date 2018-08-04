/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 模型字典
 * Last modified: 2018-07-14 14:30
******************************************************************************/

let path = require('path')
,   _    = require('lodash')
,   paginate = require('mongoose-paginate')
,   Conn = require(path.join(APP_BASE.S, 'db/mongo/client'))
;

module.exports = function(dbN, mdN){
  if(_.isEmpty(mdN)){
    mdN = dbN; dbN = null;
  }
  return new Promise(function(resolve, reject){
    try {
      let ent = require(path.join(APP_BASE.M, 'entity', mdN));
      if(!_.get(ent, '_plugins.paginate')){
        ent.schema.plugin(paginate);
        _.set(ent, '_plugins.paginate', true);
      }
      Conn(dbN).then(function(conn){
        resolve(conn.model(ent.collection, ent.schema, ent.table));
      }).catch(function(e){
        reject(e);
      });
    } catch(e){
      reject([{errcode: '41001'}, {field: mdN}]);
    }
  });
};
