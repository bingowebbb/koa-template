/******************************************************************************
 * Author: zyb - zyb_hust@163.com
 * Description: -- 编辑 
 * Last modified: 2018-06-13 10:58
******************************************************************************/
let path = require('path')
,   _    = require('lodash')
,   debug= require('debug')('M:areffect:list')
,   Ent  = require(path.join(APP_BASE.M, 'entity'))
;

module.exports = function(args){
  return new Promise(function(resolve, reject){
    Ent('areffect','list').then(function(Model){
      Model.findByIdAndUpdate(args.id, args.options, function(err, docs){
          if(err){
              return resolve({msg: 'id不存在'});
          }
          return resolve(docs);
      })
    }).catch(function(err){
      return reject(err);
    });
  });
}
