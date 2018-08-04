/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 开发环境配置项
 * Last modified: 2018-07-07 16:55
******************************************************************************/
let defer= require('config/defer').deferConfig;

module.exports = {
  'setting': {
    extjs: '.js'
  },
  'sys': {
    param: {
      reboot: {
        preview: 'curl -s -d \'{data}\' http://nsq-nsqd-nsq.kube-public:4151/pub?topic=umai_model_screenshot_staging'
      },
      task_queue: {
        topic: 'screenshot_wxq_test_dev_xx',
        channel: 'node-worker'
      },
      minio: {
       'areffect-bucket': 'areffect' //重置
      }
    }
  },
  'umai': {
    'api': 'http://staging-umai-umai-api.duxze.cn/v1/',
    //'api': 'http://10.0.0.26:10006/v1/',
    'headers':{
      'Content-Type':'application/json',
      'DXAPIKEY': 'd928472364a98d5e1b13839145d3836b'
    }
  },
  session: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    db: 'umai-web-operation-dev'
  },
  'fastdfs': {
      trackers: [{
          host: '10.0.0.27',
          port: 22122
      }],
      timeout: 3000,
      charset: 'utf8'
  },
  // NSQ配置
  'db': {
    'nsq': {
      'read': {
        'host': '10.0.0.24',
        'port': '4161',
        options: {
          maxInFlight: 1,
          messageTimeout: 0
        }
      },
      'write': {
        'host': '10.0.0.24',
        'port': '4150',
        options: {
        }
      }
    },
    'minio': {
      'default': {
        'port'  : '9000',
        'region': 'duxze',
        'endpoint' : '10.0.0.24',
        'accessKey': '35D4QVS06VEOCSBB4O9N',
        'secretKey': 'KvH0gNe/Po3v72NnQyb6IrzWTStBLqwKNrwcoQFQ',
        'addr': 'http://10.0.0.24:9000/',
        'bucket': 'areffect'
      }
    },
    'mongodb': {
      default: {
        url: 'mongodb://10.0.0.24:27017/areffect',
        opt: {
          server: {
            poolSize: 10
          }
        }
      },
      'areffect': {
        url: 'mongodb://10.0.0.24:27017/areffect',
        opt: {
          server: {
            poolSize: 10
          }
        }
      }
    }
  }
};
