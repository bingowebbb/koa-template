/******************************************************************************
 * Author: 郑猿冰- zyb_hust@163.com
 * Description: -- 定义类
 * Last modified: 2018-07-14 16:37
******************************************************************************/
/* global _, $, ar_ajax, Shuffle, LazyLoad, appCard, swal*/

class appCardList { 
  constructor(arg){
    this.url = 'inner.ar.list' || _.get(arg, url);
    this.$el_ct = _.get(arg, '$el_ct');
    this.page  = _.get(arg, 'page') || 1;
    this.limit = _.get(arg, 'limit') || 50;
    this.sort = _.get(arg, 'sort') || {};
    this.isEnd = this.running = false;
    this.itemSelector = '.ugc-item-unit' || _.get(arg, 'itemSelector');
    this.lazyload_selector = '.ugc-lazyload' || _.get(arg, 'lazyloadSelector');
    this.card_args = _.get(arg, 'card_args');
    this.card_opts = _.get(arg, 'card');
    this.init_waypoint();
    this.init_shuffle();
    this.init_layload(); 
    this.init_card_unit();
    _.merge(this, arg);
  }
  get count() {
    return this._count;
  }
  set count (count){
    this._count = count;
    // eslint-disable-next-line
    try { this.$el_count.text(count+' 个'); } catch(e){}
  }
  get shuffle () {
    return this._shuffleInstance;
  }
  get waypoint () {
    return this._waypoint_in;
  }
  get lazyload (){
    return this._myLazyLoad;
  }
  get card_unit (){
    return this._card_unit;
  }
  init_waypoint () {
    let sf = this;
    this._waypoint_in = this.$el_ct.waypoint(function(direction){
      if(direction == 'down' && !sf.loaded){ sf.load_data_fn();  sf.loaded = true;}
    },{ offset: 'bottom-in-view', });
  }
  init_shuffle (){
    this._shuffleInstance = new Shuffle(this.$el_ct[0], {
      itemSelector: this.itemSelector
    });
  }
  init_layload (){
    let sf = this;
    this._myLazyLoad = new LazyLoad({
      elements_selector: this.lazyload_selector,
      callback_load: function(){
        setTimeout(() => {
          sf.shuffle.update();
          setTimeout(() => {
            sf.waypoint[0].context.refresh();
          }, 100);
        }, 50);
      }
    });
  }
  init_card_unit (){
    this._card_unit = new appCard(_.merge({
      container: this.$el_ct,
      cls: [this.itemSelector.split('.')[1], 'col-sm-3 p-1'].join(' '),
      $noop: {
        putData: function(param, d){
          let data = {id: param.pk};
          data[param.name] = param.value;
          ar_ajax('inner.models.update', data)
            .done(function(){ d.resolve(); })
            .fail(function(rsp){ d.reject(rsp.errmsg); });
        }
      },
      icons: [{
        'attr': 'animationCount',
        'cls' : 'oi oi-flash'
      }]
    }, this.card_opts || {}));
  }
  remove_card ($el){
    let sf = this;
    let $unit_el = appCard.unit_element($el);
    let cardNum = this.$el_ct.find('.app-card').length;
    console.log('cardNum', cardNum);
    if(cardNum === 1){
        sf.load_data_fn();
    }
    if($unit_el.length == 0){ return; }
    this.shuffle.remove($unit_el);
    setTimeout(() => {
      this.shuffle.update();
      setTimeout(() => {
        this.waypoint[0].context.refresh();
      }, 100);
    }, 50);
  }
  _setContent ($els){
    this.shuffle.off(Shuffle.EventType.REMOVED);
    this.$el_ct.html($els);
    this.shuffle.add($els);
    setTimeout(() => {
      this.lazyload.update();
    }, 100);
  }
  items_append_fn (lists){
    let html = [];
    $.each(lists, (k, v) => {
      html.push(this.card_unit.html(v));
    });
    let $els = $(html.join(''));
    let _$els = this.$el_ct.children();
    this.shuffle.remove(_$els);
    this.shuffle.off(Shuffle.EventType.REMOVED).on(Shuffle.EventType.REMOVED, () =>{
      this._setContent($els);
    }); 
    if(!_$els.length){
      this._setContent($els);
    }
  }
  load_data_fn (){
    if(this.running){ return; }
    if(this.isEnd){
      swal({
        position: 'center', type: 'info',
        title: '没有更多啦，刷新试试吧！',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: '试试',
      }).then(function(rst) {
        rst.value && window.location.reload();
      });
      this.running = false;
      return ;
    }
    this.running = true;
    let sf = this;
    ar_ajax(this.url, {
      query: this.card_args,
      page: this.page,
      limit: this.limit,
      sort: this.sort
    }).done(function(data){
      console.log('data---', data);
      let meta = {
        total: data.total,
        page: data.page,
        pages: data.pages
      }
      sf.running = false;
      sf.count = data.total;
      sf.setPagination(meta, data.docs);
      if(!_.isEmpty(_.get(data, 'next'))){
      // sf.page++; 
      } else {
      // sf.isEnd = true;
      }
      // sf.items_append_fn(data.list);
    });
  }
  pass_fn (data, sf){
    let _sf = this;
    ar_ajax('inner.ar.pass', data)
      .done(function(){
        swal_success('提交成功啦～');
        _sf.remove_card(sf);
      })
      .fail(function(rsp){
        swal_error('提交失败');
      });
  }
  setPagination (meta, list){
    let sf = this;
    this.$el_pagination.pagination({
      dataSource: new Array(meta.total),
      pageRange: 5,
      currentPage: meta.page,
      pageNumber: meta.page,
      totalPage: meta.pages,
      totalNumber: meta.total,
      pageSize: this.limit,
      position: 'top',
      goButtonText: '确定',
      showGoInput: true,
      showGoButton: true,
      callback: function(data, pagination) {
        if(pagination.pageNumber == meta.page){
          sf.items_append_fn(list);
        } else {
          sf.page = pagination.pageNumber;
          sf.load_data_fn();
        }
      }
    });
  }
}
export {
  appCardList
};
