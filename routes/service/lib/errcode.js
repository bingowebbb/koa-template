/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 内部错误格式化处理
 * Last modified: 2017-12-18 21:18
******************************************************************************/
var _   = require('lodash')
,   FMT = require('string-format')
,   debug=require('debug')('S:lib:errcode')
,   Msg = require('config').get('sys.msg')
;

exports = module.exports = function(obj, _m_) {
  if( _.isArray(obj) ){
    _m_ = obj[1]; obj = obj[0];
  }
  if(typeof obj === 'object' && obj.errcode){
    var rep;
    if(obj.errtype && Msg[obj.errtype] && typeof Msg[obj.errtype] == 'object'){
      //预留别的库的错误码
      rep = Msg[obj.errtype][obj.errcode];
    } else {
      rep = Msg[obj.errcode];
    }
    try { obj.errmsg = FMT(obj.errmsg || '{}', rep); } catch(e) {
      debug(e);
    }
    if(_m_){
      try { obj.errmsg = FMT(obj.errmsg, _m_); }catch(e){
        debug(e);
      }
    }
  }
  return obj;
};
