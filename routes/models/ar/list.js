/******************************************************************************
 * Author: zyb - zyb_hust@163.com
 * Description: -- 列表 
 * Last modified: 2018-06-13 10:58
******************************************************************************/
let path = require('path')
,   _    = require('lodash')
,   debug= require('debug')('M:areffect:list')
,   Ent  = require(path.join(APP_BASE.M, 'entity'))
;

module.exports = function(args){
  console.log(args);
  return new Promise(function(resolve, reject){
    let query = _.get(args, 'query') || {};
    let skip = _.toNumber(args.offset) || 0;
    let limit = _.toNumber(args.limit) || 50;
    let sort = _.get(args, 'sort') || {};
    let page = _.toNumber(args.page) || 1;
    Ent('areffect','list').then(function(Model){
      Model.paginate(query, {page: page, limit: limit, skip: skip, sort: sort}, function(err, result){
        if(err){
          debug(err);
          return reject(err);
        }
        return resolve(result);
      });
    }).catch(function(err){
      return reject(err);
    });
  });
}
