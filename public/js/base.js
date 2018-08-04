/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: --  基础库
 * Last modified: 2018-07-13 12:02
******************************************************************************/
/* global swal, $ */
/* exported ar_ajax*/
/* eslint-disable */

var ar_ajax = function(evt, ent, type, async) {
  var d = new $.Deferred();
  ent = ent || {};
  $.ajax({
    type: type || 'GET',
    url: '/inner', 
    async: typeof async !== 'undefined' ? false : true,
    dataType: 'json',
    data: ar_ajax.dataHook(evt, ent),
    success: function(rsp){
      if(parseInt(rsp.errcode) != 0) {
        //301页面跳转
        if(parseInt(rsp.errcode) == 301) {
          window.location.href = rsp.redirect+'?rel='+encodeURIComponent(window.location.href);
        } else if(parseInt(rsp.errcode) == 401) {
          //权限拒绝
          swal_confirm(rsp.errmsg || '权限拒绝！', function(){
            window.location.href = '/login';
          }); 
        } else {
          if(parseInt(rsp.errcode) < 100) {
            //内部错误，报错， 否则不提醒
            swal(rsp.errmsg || '数据读取错误！'); 
          }
        }
        return d.reject(rsp);
      }
      d.resolve(rsp.data);
    }   
  }); 
  return d.promise();
};
ar_ajax.dataHook = function(evt, ent){
  return {
    eventType: evt,
    entity   : JSON.stringify(ent)
  };
};
