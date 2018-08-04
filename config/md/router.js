/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 路由代理
 * Last modified: 2018-07-15 18:35
******************************************************************************/

module.exports = [
  { path: '', action: 'outside', type: 'middle' },
  { path: '/inner', action: 'inner', type: 'middle' }
];
