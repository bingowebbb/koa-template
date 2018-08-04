/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 默认配置项
 * Last modified: 2018-07-07 16:54
******************************************************************************/

module.exports = {
  env: {
    multi_cpu: true
  },
  sys: {
   'port' : '8084',
   'title': 'AR-effect运营平台',
   'name' : 'areffect-operation',
   'state': require('./data/state'),
   'apicf': require('./md/apis'),
   'route': require('./md/router'),
   'param': require('./md/parameter'),
   'msg'  : require('./md/msg/index'),
   'innerurl': require('./md/innerurl'),
   'execrewrite': require('./md/execrewrite')
  },
  session: {
    key: 'koa:sess',
    db_cfg: 'default',
    renew: true,
    rolling: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    db: 'areffect-operation-dev',
    collection: 'web_operation_sessions'
  },
  ldap: {
    server: {
      url: 'ldap://lflan.duxze.com',
      bindDN: 'cn=admin,dc=duxze,dc=com',
      bindCredentials: 'duxze',
      searchBase: 'ou=staff,dc=duxze,dc=com',
      reconnect: true,
      searchFilter: '(cn={{username}})'
    },
    usernameField: 'login_username',
    passwordField: 'login_password'
  }
};
