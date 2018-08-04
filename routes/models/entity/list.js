/******************************************************************************
 * Author: zyb - zyb_hust@163.com
 * Description: -- 壁纸列表 
 * Last modified: 2018-07-16 10:48
******************************************************************************/
let Schema   = require('mongoose').Schema;

module.exports = {
  collection: 'Ar_Effect',
  schema: new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    deeplink: String,
    icon: String,
    media: String,
    snapcode: String,
    author: String,
    tags: Array,
    viewCount: Number,
    downloadCount: Number,
    online: Boolean
  },{
    versionKey: false,
    timestamps: true
  }),
  table: 'Ar_Effect'
}
 
