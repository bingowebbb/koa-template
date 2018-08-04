/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: --  系统相关的全局设置
 * Last modified: 2018-07-07 16:57
******************************************************************************/

var path  = require('path')
  , ROOT  = path.dirname(__dirname, '..')
  , _rts  = path.join(ROOT, 'routes')
;
global.APP_BASE = {
  R: _rts,
  ROOT: ROOT,
  V: path.join(ROOT, 'views'),
  P: path.join(ROOT, 'public'),
  T: path.join(_rts, 'tools'),
  U: path.join(ROOT, 'upload'),
  M: path.join(_rts, 'models'),
  A: path.join(_rts, 'action'),
  S: path.join(_rts, 'service')
};
const PARAM = require('config').get('sys.param');
global.ERRD = require(path.join(APP_BASE.S, 'lib/errcode'));
/*
if( !fs.existsSync(PARAM['models-work-dir']) ){
  fs.mkdirSync(PARAM['models-work-dir']); 
}
*/
