/******************************************************************************
 * Author: 郑猿冰 - zyb_hust@163.com
 * Description: -- 对外提供的接口
 * Last modified: 2018-07-14 14:16
******************************************************************************/

let path = require('path')
,   _    = require('lodash')
,   debug= require('debug')('A:outside')
,   fs = require('fs')
,   route= new (require('koa-router'))()
,   List  = require(path.join(APP_BASE.M, 'ar/list'))
,   Tags = require(path.join(APP_BASE.M, 'ar/tags'))
,   Edit = require(path.join(APP_BASE.M, 'ar/edit'))
,   Find = require(path.join(APP_BASE.M, 'ar/find'))
,   Ent  = require(path.join(APP_BASE.M, 'entity'))
,   dbCnf= require('config').get('db.minio')
,   Minio = require('minio')
,   uploadFile  = require(path.join(APP_BASE.S, 'db/minio/apis/uploadObject'))
,   exec = require('child_process').exec;

let api = 'http://staging-zhengyuanbing-areffect-opetation.duxze.cn/v1/';

const minioClient = new Minio.Client({
    'port'  : parseInt(dbCnf['default'].port) || 9000,
    'secure': ~~dbCnf['default'].secure ? true : false,
    'region': dbCnf['default'].region || '',
    'endPoint' : dbCnf['default'].endpoint,
    'accessKey': dbCnf['default'].accessKey,
    'secretKey': dbCnf['default'].secretKey
});

function getData(type, ctx, sort) {
  return new Promise(async function(resolve, reject){
    let list = [], prev = "", next = "";
    let page = Number(ctx.request.query.page) || 1;
    let query = ctx.request.query.tag ? { tags: decodeURIComponent(ctx.request.query.tag) } : {};
    query.online = true;
    let args = { page: page, limit: 20, sort: sort, query: query}; 
    let data = await List(args);
    if(data.page < data.pages) next = api + type + "?page=" + (page + 1).toString();
    if(data.page > 1) prev =  api + type + "?page=" + (page - 1).toString();
    data.docs.forEach(item => {
      let it = {
        id: item._id,
        tags: item.tags,
        title: item.title,
        viewCount: item.viewCount,
        downloadCount: item.downloadCount,
        icon: item.icon,
        media: item.media,
        snapcode: item.snapcode,
        deeplink: item.deeplink,
        author: item.author,
        createdAt: item.createdAt,
        updateAt: item.updateAt
      };
      list.push(it);
    });
    return resolve({
      list: list,
      prev: prev,
      next: next
    });
  })
}

// 下载量 先查库再改库，分开写
route.put('/v1/down', async function(ctx){
  ctx.request.body = _.merge(ctx.request.body, ctx.req.body);
  ctx.type = 'json';
  let q = ctx.request.query;
  let find = await Find({id: q.id});
  let edit = await Edit({id: q.id, options: {downloadCount: find.downloadCount + 1}});
  ctx.body = edit;
});

route.get('/v1/taglist', async function(ctx){
   ctx.request.body = _.merge(ctx.request.body, ctx.req.body); 
   ctx.type = 'json';
   let data = await Tags();
   ctx.body = {
      list: data
   }
});


// 处理文件上传
route.post('/v1/upload', async function(ctx){
  let [bucket, domain] = [dbCnf['default'].bucket, dbCnf['default'].addr]; // 解构赋值
  ctx.request.body = _.merge(ctx.request.body, ctx.req.body);
  let fileType = ctx.request.query.type;
  let file = ctx.request.files.file; // 获取上传文件
  let reader = fs.createReadStream(file.path);
  let filePath = path.join(APP_BASE.P, 'upload') + `/${file.name}`;
  let upStream = fs.createWriteStream(filePath);
  reader.pipe(upStream);
  let folder = new Date().getTime().toString() + '/';
  let uid = await uploadFile(bucket, folder, file, fileType);
  let delCmd = "rm -rf " + filePath;
  exec(delCmd, function(err, res){
    if(!err) console.log("删除成功");
  });
  ctx.body = {
      url: decodeURIComponent(domain + bucket + '/' + folder + uid)
  }
});

route.all('/v1/*', async function(ctx){
  ctx.request.body = _.merge(ctx.request.body, ctx.req.body);
  ctx.type = 'json';
  ctx.body = {
      message: "接口不存在"
  };
});

// 设置跨域
route.all('/v1', async function(ctx) {
    ctx.header("Access-Control-Allow-Origin", "*");
    ctx.header("Access-Control-Allow-Headers", "X-Requested-With");
    ctx.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    ctx.header("X-Powered-By",' 3.2.1')
    ctx.header("Content-Type", "application/json;charset=utf-8");
});

module.exports = route.routes();
