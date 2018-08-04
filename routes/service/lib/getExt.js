/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 获取文件的文件类型
 * Last modified: 2017-12-18 21:42
******************************************************************************/

const path      = require('path');
const fs        = require('fs-extra');
const mime      = require('mime-types');
const fileType  = require('file-type');
const readChunk = require('read-chunk');

module.exports = function(file){
  if(fs.pathExistsSync(file)){
    let ext = fileType(readChunk.sync(file, 0, 4100));
    if(ext){ return ext; }
  }
  return {
    mime: mime.lookup(file) || 'application/octet-stream',
    ext: path.extname(file).substr(1) || mime.extension(file)
  };
};
