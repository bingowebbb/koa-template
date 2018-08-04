/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- snq链接初始化
 * Last modified: 2017-12-18 10:12
******************************************************************************/
var NSQ  = require('nsqjs')
,   _    = require('lodash')
,   Async= require('async')
,   debug= require('debug')('db:nsq')
,   dbCnf= require('config').get('db.nsq');

// 可让队列中数据完成的错误类型
const FINISH_ERRCODE = require('config').get('sys.param.nsq_msg_finish_errcode');

class Client {
  /**
   * 根据参数初始化 new `Client`.
   */
  constructor(arg) {
    _.merge(this, arg);
    this.READER = {};
    this.WRITER = null;
  }
  /**
   * @api private 
   * @param {String} topic
   * @param {String} channel
   * @return {Client} 
   **/
  _readClient(topic, channel){
    return _.update(this.READER, [topic, channel], reader => {
      if( !reader ){
        reader = new NSQ.Reader(topic, channel, this.nsqdTCPAddresses ? {
          nsqdTCPAddresses: this.nsqdTCPAddresses
        } : {
          lookupdHTTPAddresses: this.lookupdHTTPAddresses || [this.host, ':',this.port].join('') 
        });
        reader.connect();
        reader.on('nsqd_connected', function(msg){
          debug('-- connected---', msg);
        });
        reader.on('nsqd_closed', function(msg){
          //重新连接
          reader.connect();
          debug('---- nsqd_closed---', msg);
        });
        reader.on('discard', function(error){
          debug('-----discard-----', error);
        });
      }
      return reader;
    })[topic][channel];
  }

  /**
   * @api public `inRead`
   * @param {String} topic
   * @param {String} channel
   * @param {Function} next
   * */
  inRead(topic, channel, next){
    let reader = this._readClient(topic, channel);
    reader.once('error', function(error){
      // eslint-disable-next-line
      debug('--get read client error:', error);
      next(
        ERRD([{errcode: '1001', errmsg: error}, {field: 'nsq'}])
        , null, function(_error, rst_next){
          debug('-read-error-----', error);
          rst_next();
        });
    });
    reader.once('message', function(msg){
      var timmer;
      const touch = () => {
        if (!msg.hasResponded) {
          debug('Touch [%s]', msg.id);
          msg.touch();
          timmer = setTimeout(touch, msg.timeUntilTimeout()*3/4);
        } else {
          clearTimeout(timmer);
        }
      };
      //提前1秒让它别过期
      timmer = setTimeout(touch, msg.timeUntilTimeout()*3/4);
      next(null, msg, function(error, rst_next){
        if(!error || _.indexOf(FINISH_ERRCODE, error.errcode) !== -1){
          debug('---message---finish---');
          msg.finish();
          clearTimeout(timmer);
        }
        rst_next();
      });
    });
  } 
  // eslint-disable-next-line
  inWrite(topic, message, next){
      debug('-----inWrite---');
      let self = this;
      Async.waterfall([
          function(cb){
              if( !self.WRITER ){
                  let writer = self.WRITER = new NSQ.Writer( self.host, self.port, self.options);
                  writer.connect();
                  writer.on('closed', () => {
                      self.WRITER = null;
                  });
                  writer.on('ready', function(){
                      writer.__client_ready = self.WRITER.__client_ready = true;
                  });
              }
              Async.whilst(function(){
                  return !self.WRITER.__client_ready;
              }, function(cb){
                  //0.1s检查一次
                  setTimeout(function(){ cb(null); }, 100);
              }, function(){
                  cb(null,  self.WRITER);
              });
          }
      ], function(err, writer){
          writer.publish(topic, JSON.stringify(message), err => {
              next(err);
          });
      });
  }
}

const CLIENTS = {};
module.exports = function(dbN){
  if(!_.isString(dbN)){
    dbN = 'default';
  }
  if(!_.has(dbCnf, dbN)){
    debug('No db ',dbN,' paramter config');
  }
  if(!CLIENTS[dbN]){
    return CLIENTS[dbN] = new Client({
      host: dbCnf[dbN].host || null,
      port: dbCnf[dbN].port || null,
      options: dbCnf[dbN].options || {},
      nsqdTCPAddresses: dbCnf[dbN].nsqdTCPAddresses || null,
      lookupdHTTPAddresses: dbCnf[dbN].lookupdHTTPAddresses || null
    });
  } 
  return CLIENTS[dbN];
};
