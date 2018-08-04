/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 生产环境配置项
 * Last modified: 2018-07-07 16:55
******************************************************************************/

let ENV = process.env;
let defer= require('config/defer').deferConfig;
module.exports = {
  'setting': {
    extjs: '.min.js'
  },
  'sys': {
    param: {
      reboot: {
        preview: 'curl -s -d \'{data}\' http://nsq-nsqd-nsq.kube-public:4151/pub?topic=umai_model_screenshot_staging'
      },
      task_queue: {
        topic: 'umai_model_create_staging',
        channel: 'node-worker'
      },
      minio: {
       'areffect-bucket': 'areffect' //重置
      }
    }
  },
  'umai': {
    'api': 'http://staging-umai-umai-api.duxze.cn/v1/',
    'headers':{
      'Content-Type':'application/json',
      'DXAPIKEY': 'd928472364a98d5e1b13839145d3836b'
    }
  },
  session: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    db: 'umai-web-operation'
  },
  'fastdfs': {
      trackers: [{
          host: '10.3.0.249',
          port: 22122
      }, {
          host: '10.3.0.250',
          port: 22122
      }],
      timeout: 3000,
      charset: 'utf8'
  },
  // NSQ配置
  'db': {
    'nsq': {
      'read': {
        'host': process.env['NSQ_READ_HOST'] || 'nsq-lookupd-nsq.kube-public',
        'port': process.env['NSQ_READ_PORT'] || '4161',
        'options': {
          maxInFlight: 1,
          messageTimeout: 0
        }
      },
      'write': {
        'host': ENV['NSQ_WRITE_HOST'] || 'nsq-nsqd-nsq.kube-public',
        'port': ENV['NSQ_WRITE_PORT'] || '4150',
        'options': {
        }
      }
    },
    'minio': {
      'default': {
        'port'  : process.env['MINIO_PORT'] || '9000',
        'region': process.env['MINIO_REGION'] || 'lf',
        'endpoint' : process.env['MINIO_ENDPOINT']  || '172.16.50.5',
        'accessKey': process.env['MINIO_ACCESSKEY'] || 'duxze',
        'secretKey': process.env['MINIO_SECRETKEY'] || 'UGCugc20171010',
        'addr': 'https://storage.duxze.com/',
        'bucket': 'areffect.staging'
      }
    },
    'mongodb': {
      default: {
        url: 'mongodb://db-mongodb.kube-public:27017/areffect_staging',
        opt: {
          server: {
            poolSize: 10
          }
        }
      },
      'areffect': {
        // url: 'mongodb://10.0.0.24:27017/areffect',
        url: 'mongodb://db-mongodb.kube-public:27017/areffect_staging',
        opt: {
          server: {
            poolSize: 10
          }
        }
      },
      'app': {
        url: 'mongodb://10.3.0.56:27017, 10.3.0.149:27017, 10.3.0.151:27017/app_vlocker',
        opt: {
          native_parser: true,
          poolSize: 10 ,
          auto_reconnect: true,
          replset: { 
            rs_name: 'contents',
            connectTimeoutMS: 3000
          }
        }
      }
    }
  }
};
