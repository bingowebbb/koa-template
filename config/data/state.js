/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 注入到app.context中的数据
 * Last modified: 2018-07-13 20:51
******************************************************************************/
let _    = require('lodash')
,   defer= require('config/defer').deferConfig
;

module.exports = {
  setting: defer(function(cfg){
    return _.merge({
      version: Date.now(),
      title: cfg.sys.title,
      viewHost: '',
      upload:  {
        quality: 95,
        Filedata: cfg.sys.param.upload.fieldname
      },
    }, cfg.setting);
  })
};
