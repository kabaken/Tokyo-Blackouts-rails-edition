Ext.ns('BO');

BO.Notice = Ext.extend(Ext.Panel, {
  modal: true,
  floating: true,
  centered: true,
  width: 300,
  height: 250,
  scroll: 'vertical',
  styleHtmlContent: true,

  tpl: ['<div class="bonotice">',
          '<span>住所：</span>',
          '<ul>',
            '<li>{address}</li>',
          '</ul>',
          '<span>今日の予定：</span>',
          '<ul>',
          '<tpl for="group">',
            '<li>{group}{subgroup}：{slot}：',
							'<tpl if="status==\'未定\'"><span style="color:gray">未定</span></tpl>',
							'<tpl if="status==\'実施\'"><span style="color:blue">実施</span></tpl>',
							'<tpl if="status==\'中止\'"><span style="color:red">中止</span></tpl>',
//							'<tpl if="status==\'笑顔\'"><span style="color:red">笑顔</span></tpl>',
						'</li>',
          '</tpl>',
          '</ul>',
        '</div>'].join(''),

  scroll: 'vertical',

  initComponent: function(){
    this.dockedItems = [{
      dock: 'top',
      xtype: 'toolbar',
      title: (new Date()).format('n月j日'),
      items: [{
        xtype: 'spacer'  
      },{
        text: '閉じる',
        ui: 'decline',
        handler: this.onClose,
        scope: this
      }]
    }];

    BO.Notice.superclass.initComponent.call(this);
  },

  onClose: function(){
    this.destroy();
  }
});

Ext.reg('bonotice',BO.Notice);
