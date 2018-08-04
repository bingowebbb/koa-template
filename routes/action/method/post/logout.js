/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 登出
 * Last modified: 2018-07-11 02:05
******************************************************************************/

module.exports = function(user, ctx){
  ctx.logout();
  ctx.redirect('/login');
};
