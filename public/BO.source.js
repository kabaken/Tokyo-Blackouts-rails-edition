Ext.ns('BO');

BO.Source = Ext.extend(Ext.Panel, {
  viewTpl: '<div><tpl for="."><div class="bodetail"><a href="{url}" target="_blank" class="url">{pref}</a><br><span class="update">最終更新日：{update:date("Y/m/d")}</span></div></tpl></div>',

  viewSelector: 'div.bodetail',

  initComponent: function(){
    this.layout = 'fit';

    this.dockedItems = [{
      dock: 'top',
      xtype: 'toolbar',
      title: '情報源'
    }];

    this.items = [{
      xtype: 'dataview',
      tpl: this.viewTpl,
      itemSelector: this.viewSelector,
      store: this.store
    }];

    BO.Source.superclass.initComponent.call(this);
  }
});

Ext.reg('bosource',BO.Source);
