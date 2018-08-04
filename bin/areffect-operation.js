#!/usr/bin/env node
require('../config/setting');
/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 启动入口
 * Last modified: 2018-07-07 17:29
******************************************************************************/

let app     = require('../index')
,   cluster = require('cluster')
,   numCpus = require('os').cpus().length
,   port    = require('config').get('sys.port')
,   title   = require('config').get('sys.title')
,   debug   = process.env.NODE_ENV !== 'production';

/*
const MORE_CPUS = require('config').get('env.multi_cpu');
if(cluster.isMaster){
  process.title = title+'-master';
  do {cluster.fork();} while(!debug && MORE_CPUS && --numCpus);
  cluster.on('disconnect', function() {
    console.error('disconnect! '+Date.now());
    cluster.fork();
  });
} else {
  process.title = title+'-worker' + cluster.worker.id;
  */
  app.listen(process.env.PORT || port);
//}
