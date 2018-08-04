/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 模版渲染并缓存，发送
 * Last modified: 2018-07-08 10:45
 ******************************************************************************/
let path   = require('path')
,   qs     = require('qs')
,   ejs    = require('ejs')
,   _      = require('lodash')
,   fs     = require('fs-extra')
,   crypto = require('crypto')
,   send   = require('koa-send')
,   state  = require('config').get('sys.state')
,   debug  = require('debug')('S:dhtml:sendFile')
,   writeF = require(path.join(APP_BASE.S, 'lib/file/writeFile'))
;

_.merge(ejs.filters, {
  encodeData:  function(li){
    return encodeURIComponent(JSON.stringify(li));
  },
  decodeData:  function(li){
    return JSON.parse(decodeURIComponent(li));
  }
});
function md5(text) { return crypto.createHash('md5').update(text).digest('hex'); }

module.exports = async function(options, ctx, callbacks) {
  let mejs = path.join(path.dirname(options.dir), path.basename(options.dir, '.html'));
  debug('---mejs--: ', mejs);
  if(options.__cached !== true) {
    debug('----in --cached-- false--');
    let html = await module.goRender(mejs, ctx, callbacks);
    ctx.type = 'html';  
    ctx.body = html;
    return html;
  } else {
    var _idf = [], _q_obj = options.idf || qs.parse(ctx.querystring), filename = options.filename || ''; 
    if(!filename) {
      for(var i in _q_obj){ _idf.push([i, _q_obj[i]]); }
      filename = md5(options.dir + JSON.stringify(_idf.sort()));
    }
    let root = path.join(APP_BASE.ROOT, 'html');
    let resfile = path.join(path.dirname(options.dir), filename + '.html');
    try {
      await send(ctx, resfile, {root: root});
      _.isFunction(_.get(callbacks, 'success')) && callbacks.success();
    } catch(err){
      let html = await module.goRender(mejs, ctx, callbacks);
      await writeF(path.join(root, resfile), html);
      await send(ctx, resfile, { root: root});
      return html;
    }
  }
};

module.goRender = async function(mejs, ctx, callbacks){
  if(module.lookup(mejs, ctx) === false && _.isFunction(_.get(callbacks, 'noTpl'))){
    return await callbacks.noTpl();
  } else if(_.isFunction(_.get(callbacks, 'faile'))) {
    try {
      let data = await callbacks.faile(); 
      let html = await ctx.render(mejs, _.merge(data || {}, state, { writeResp: false}));
      return html;
    } catch(err){
      debug('err :', err);
        if(_.isFunction(_.get(callbacks, 'errFn'))) {
          return await callbacks.errFn();
        } else {
          ctx.redirect('/404.html');
        }
      }
  } else { 
    return ctx.redirect('/404.html');
  }
};

let exis_ejs = {};
module.lookup = function(__path){
  let _path = path.join(APP_BASE.V, [__path,'.ejs'].join(''));
  debug('-_path: ', _path);
  if ((_path in exis_ejs && exis_ejs === true) || fs.pathExistsSync(_path)) {
    exis_ejs[_path] = true;
    return _path;
  } else {
    return false;
  }
};
