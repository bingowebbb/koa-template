/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 加载文件
 * Last modified: 2018-07-07 19:47
 ******************************************************************************/
let path = require('path')
,   fs   = require('fs')
,   _    = require('lodash')
,   debug= require('debug')('S:load')
,   Map  = {}
,   Load = {}
,   _debug = process.env.NODE_ENV !== 'production';

function isArray(v){    
  return Object.prototype.toString.apply(v) === '[object Array]';
}
Load.load = function(file_width_path_name){
  _debug && debug(file_width_path_name, '-----load----------');
  if(!(file_width_path_name in Map) || _debug) {
    if(fs.existsSync(file_width_path_name)) {
      // eslint-disable-next-line
      fs.watch(file_width_path_name, function(event, filename){
        if(event == 'change') { delete require.cache[file_width_path_name];}
      });
      Map[file_width_path_name] = require(file_width_path_name);
    } else {
      _debug && debug(file_width_path_name + ' not found');
      Map[file_width_path_name] = undefined;
    }
  }
  return Map[file_width_path_name];
};

Load.wrapLoad = function(name){
  return Load.load(path.join(path.dirname(name), path.basename(name, path.extname(name)))+ '.js');
};
Load.Aload = function(name){
  isArray(name) || (name = [String(name).replace(/\.\./g, '').replace(/^\//,'')]);
  name = path.resolve(APP_BASE.A, path.join.apply(path, name));
  return Load.wrapLoad(name);
};

Load.Sload = function(name){
  isArray(name) || (name = [String(name).replace(/\.\./g, '').replace(/^\//,'')]);
  name = path.resolve(APP_BASE.S, path.join.apply(path, name));
  return Load.wrapLoad(name);
};

Load.RLoad = function(dname, rpath){
  var Action = Load.wrapLoad(path.join(dname, rpath));
  if(!_.isFunction(Action)){
    Action = Load.wrapLoad(path.join(dname, path.dirname(rpath)));
    if(!_.isFunction(Action)){
      Action = Load.wrapLoad(path.join(dname, 'index'));
      if(!_.isFunction(Action)){
        Action = null;
      }   
    }   
  }   
  return Action;
};

module.exports = Load;
