/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- inner 接口
 * Last modified: 2018-07-10 18:10
******************************************************************************/
let path = require('path'),
    INNER= path.join(APP_BASE.A, 'api');

module.exports = {
  'inner.ar.list': path.join(INNER, 'list'),
  'inner.ar.add': path.join(INNER, 'add'),
  'inner.ar.delete': path.join(INNER, 'delete'),
  'inner.ar.edit': path.join(INNER, 'edit'),
  'inner.ar.tags': path.join(INNER, 'tags')
};
