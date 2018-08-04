/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 添加新作品 
 * Last modified: 2018-07-13 16:12
******************************************************************************/
let path = require('path')
,   List = require(path.join(APP_BASE.M, 'ar/delete'));
;

module.exports = async function(data){
  try {
    return await List(data);
  } catch(e){
    throw e;
  }
};
