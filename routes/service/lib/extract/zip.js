/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: --  zip文件的解压缩
 * Last modified: 2017-12-18 20:23
******************************************************************************/

var path = require('path')
,   _    = require('lodash')
;

const { exec } = require('child_process');

module.exports = function(file, target, options, next){
  exec(['unzip', '-o', file, '-x', '__MACOSX/*', '-d', target].join(' '), function(err, stdout, stderr){
    next(err);
  });
};
