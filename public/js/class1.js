/******************************************************************************
 * Author: zyb- zyb_hust@163.com
 * Description: -- 壁纸视频卡片展示模式
 * Last modified: 2018-06-14 11:57
******************************************************************************/
/* global _, $, Entity, colr, config */
'use strict';

// eslint-disable-next-line
class appCard {
  static get unit_name () {
    return 'jsunit-app-card';
  }
  static unit_element ($el){
    return $($el).closest('.'+ appCard.unit_name);
  }
  static get zoom (){
    return 3;
  }
  constructor (options) {
    let sf = this;
    this.__store = {};
    this._options= options || {};
    this.__units = {};
    this.$noop  = _.get(this._options, '$noop') || {};
    this.__fields = [];
    (_.get(this._options, 'entity') || []).forEach((v) => {
      console.log("entity===:", v);
      this.__fields.push(v.field);
      this.__units[v.field] = new Entity[_.upperFirst(_.toLower(v._unit || v.field))](
        _.merge({
          container: this._options.container,
          url: function(params){
            let data = sf.data(this);
            params.pk = data.id;
            var d = new $.Deferred();
            sf.$noop.putData.call(this, params,d);
            return d.promise();
          },
          $noop: {
            unit_element: Card.unit_element
          }
        }, v.options)
      );
    });
  }
  uniqueId (v){
    return _.isFunction(_.get(this.$noop, 'uniqueId'))
      ? this.$noop.uniqueId(v)
      :  _.uniqueId(appCard.unit_name);
  }
  data($el, item){
    let uqId = appCard.unit_element($el).data('_uqid');
    return _.get(this.__store, [uqId].concat(item ? item : []).join('.'));
  }
  _sdata (uqId, data){
    this.__store[uqId] = data;
  }
  _icons (v){
    let icons = [];
    _.forEach(_.get(this._options, 'icons') || [], function(_v){
      if(_.isFunction(_v, 'display')){
        return icons.push(_v['display'](v, _v));
      }
      icons.push([
        '<span class="badge badge-secondary ',_.get(_v, 'cls') ,'">',
        '&nbsp;',_.get(v, _v['attr']),
        '</span>'
      ].join(''));
    });
    return icons;
  }
  field (v){
    let html = [];
    _.forEach(this.__fields, (fld) =>{
      html.push(this.__units[fld].display(v));
    });
    return html.join('');
  }
  html (v){
    let uqId= this.uniqueId(v);
    this._sdata(uqId, v);
    let author = _.get(v, 'author'), 
        icon = _.get(v, 'icon'), 
        title = _.get(v, 'title'),
        deeplink = _.get(v, 'deeplink'),
        tags = _.get(v, 'tags'),
        media = _.get(v, 'media'),
        date = (new Date(_.get(v, 'updatedAt'))).toLocaleString();
    let b_css= _.get(v, 'status.processing') != 'SUCCESSED' ? 'border-primary' : 'border-success';
    let html = [
      '<div class="',[appCard.unit_name, _.get(this._options, 'cls')].join(' '),'" data-_uqid="',uqId,'">',
      '<div class="app-card card border ', b_css, '" style="padding: 2px; width: 100%; position: relative;">',
      '<button class="btn-sm btn-warning ugc-ar-edit" style="position:absolute; cursor: pointer; display:none;">编辑</button>',
      ' <div class="ugc-preview-areffect" style="display: block; float: left; width: 50%; height: 220px">',
      '   <img style="border-radius: 4px; position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%);" width="100%" height="100%" class="card-img-app ugc-lazyload" data-src="',icon,'" alt="',_.get(v, 'title'),'"/>',
      ' </div>',
      ' <div class="app-card-body ',_.get(this._options, 'body.cls'),'" style="width: 49%; position: absolute; right: 0; top: 0; padding: 10px 5px">',
      _.isFunction(_.get(this._options, 'body.before')) ? _.get(this._options, 'body.before')(v) : '',
      _.isFunction(_.get(this._options, 'body.display')) ? _.get(this._options, 'body.display')(v) : [
        '   <p class="card-text">',
        '      <span class="d-block app-info-item" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><strong>作者：</strong>',author,'</span>',
        '      <span class="d-block app-info-item" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><strong>标题：</strong>',title,'</span>',
        '      <span class="d-block app-info-item" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><strong>标签：</strong>',tags,'</span>',
        '      <span class="d-block app-info-item" style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><strong>链接：</strong><a href="',deeplink,'" target="_blank">',deeplink,'</a></span>',
        '   </p>',
      ].join(''),
      _.isFunction(_.get(this._options, 'body.after')) ? _.get(this._options, 'body.after')(v) : '',
      ' </div>',
      ' </div>',
      '</div>'
    ];
    return html.join('');
  }
}
export {
  appCard
};
