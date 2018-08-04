/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 文件包解压缩
 * Last modified: 2017-12-18 20:19
******************************************************************************/

var path = require('path')
  , _    = require('lodash')
  , debug= require('debug')('lib:extract')
  , GExt = require(path.join(APP_BASE.S, 'lib/getExt'))
;

const FORMAT = {
  zip: {
    ext: ['zip'],
    exec: require(path.format({ base: 'zip.js', dir: path.join(APP_BASE.S, 'lib/extract') }))
  }
};
  
module.exports = function(file, target, options, next){
  if(arguments.length == 3 && _.isFunction(options)){
    next = options; options = {};
  }
  const _fmt = GExt(file)['ext'];
  let key = _.findKey(FORMAT, function(o){
    return _.indexOf(o.ext, _fmt) !== -1;
  });
  let item = FORMAT[key];
  if(_.has(item, 'exec') && _.isFunction(item.exec)){
    item.exec(file, target, options, next);
  } else {
    debug('发现不支持的文件解压类型--【',_fmt,'】');
    next( ERRD.apply(ERRD, [{errcode: '1003'}, {field: _fmt}]) );
  }
};
