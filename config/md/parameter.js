/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 内部参数设置
 * Last modified: 2017-12-18 09:03
******************************************************************************/
let path = require('path')
;

module.exports = {
  upload: {
    fieldname: 'Fieldname',
    dir: path.join(APP_BASE.P, 'upload'),
    static: {
      pdir: '/timages',
      sdir: path.join(APP_BASE.ROOT, 'public/timages')
    }
  },
  nsq_msg_finish_errcode: ['1002'],
  // eslint-disable-next-line
  static_ext: ['*\.js', '*\.css', '*\.png', '*\.jpg', '*\.jpeg', '*\.map', '*\.mp4','*\.avi','*\.h264','*\.mkv'],
  web_end: {
    'no-login': [
      '/login'
    ]
  }
};
