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
						'<li>グループ{group}：{slot}</li>',
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
