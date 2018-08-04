/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: --  session 保持
 * Last modified: 2018-07-07 19:48
******************************************************************************/

let session = require('koa-session')
,   passport= require('koa-passport')
,   ldapA   = require('passport-ldapauth')
,   ldapC   = require('config').get('ldap')
,   MonStore= require('koa-session-mongo2')
,   SESSCFG = require('config').get('session')
,   DBURLCFG= require('config').get(['db.mongodb', SESSCFG.db_cfg].join('.'))
;

module.exports = function(app, next){
  app.keys = ['areffect-operation'];
  app.use(session({
    key: SESSCFG.key,
    renew: SESSCFG.renew, 
    rolling: SESSCFG.rolling,
    maxAge: SESSCFG.maxAge,
    store:  new MonStore({
      url: DBURLCFG.url,
      db: SESSCFG.db,
      collection: SESSCFG.collection,
      maxAge: SESSCFG.maxAge
    })
  }, app));
  passport.use(new ldapA(ldapC));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.deserializeUser(async function(user, done) {
    done(null, JSON.parse(user || {}));
  });
  next(null);
};
