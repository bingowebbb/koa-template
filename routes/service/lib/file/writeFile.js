/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 写入文件
 * Last modified: 2018-07-08 12:22
******************************************************************************/

let path= require('path')
,   fs  = require('fs-extra')
;

module.exports = async function(inFile, html){
  await fs.ensureDir(path.dirname(inFile));
  return new Promise(function(resolve, reject){
    fs.writeFile(inFile, html, function(error){
      if(error){
        return reject(error);
      }
      return resolve();
    });
  });
};
