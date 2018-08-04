/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 接入外部api
 * Last modified: 2018-07-10 21:18
******************************************************************************/
require('urijs/src/URITemplate');
let _    = require('lodash')
,   URI  = require('urijs')
,   Async= require('async')
,   Curl = require('needle')
,   Reqst= require('request')
,   debug= require('debug')('apis:umai')
,   defer= require('config/defer').deferConfig
;

let umai = {
  statusCode: [200, 201],
  request: defer(function(cfg){
    return function(type, args, next, pathOpt){
      let SF = _.get(umai.apis, type)
        ,   ACT= _.get(Curl, _.toLower(SF.method))
        ,   url = URI(cfg.umai.api).pathname(URI.joinPaths(cfg.umai.api, URI.expand(SF.path, pathOpt))).toString()
      ;
      if(_.get(SF, 'source') === 'outer'){
        url = _.get(SF, 'path');
      }
      console.log(url, '-----args', args)
      if(!_.isFunction(ACT)){
        return next([{errcode: 40010}, {field: ['needle', SF.method]}]);
      }
      debug('--url-:', url, '--args: ', args);
      Async.waterfall([
        function(cb){
          if(!SF.fn){
            Curl.request(SF.method, url, args, {
              headers: _.merge(_.get(pathOpt, 'headers') || {}, cfg.umai.headers)
            }, cb);
          } else {
            SF.fn({
              method: SF.method, url: url, json: true, formData: _.isEmpty(args) ? {} : args,
              headers: _.merge(_.get(pathOpt, 'headers') || {}, cfg.umai.headers)
            }, cb);
          }
        }
      ], function(err, rsp, body){
        //debug('----body: ', body, '-----sttue: ', rsp.statusCode);
        if(err){
          return next({errcode: 50000, errmsg: err}, rsp, body);
        }
        if(_.indexOf(SF.statusCode || umai.statusCode, rsp.statusCode) == -1){
          return next({errcode: rsp.statusCode, errmsg: _.get(body, 'message')}, rsp, body);
        }
        next(err, rsp, body);
      });
    };
  }),
  // 外部api接入
  apis: {
    // example
    'app.upload': {
      fn: Reqst,
      method: 'POST',
      path: 'http://vlocker.moxiu.com/v4/video.php?do=Video.Publish',
      source: 'outer'
    }
  }
};
module.exports = umai;
