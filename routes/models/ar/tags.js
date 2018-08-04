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

module.exports = function(){
  let tags = [];
  return new Promise(function(resolve, reject){
    Ent('areffect','list').then(function(Model){
      Model.find({}, function(err, result){
        if(err){
          debug(err);
          return reject(err);
        }
        result.length && result.forEach(item => {
            item.tags.forEach(tag => {
                if(tags.indexOf(tag) < 0){
                    tags.push(tag);
                }
            })
        });
        return resolve(tags);
      });
    }).catch(function(err){
      return reject(err);
    });
  });
}
