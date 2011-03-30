Ext.ns('BO');

BO.Info = Ext.extend(Ext.Panel, {
  tpl: ['<div class="boinfo">',
          '<span class="add">住所：{address}</span><br>',
          '<span id="timezone">時間帯：</span>',
          '<ul>',
          '<tpl for="detail">',
            '<li class="h2s">グループ：{group}{subgroup}</li>',
            '<ul class="rabox">',
            '<tpl for="slots">',
              '<li>{day:date("m/d")}：{slot}：',
								'<tpl if="status==\'未定\'"><span style="color:gray">未定</span></tpl>',
								'<tpl if="status==\'実施\'"><span style="color:blue">実施</span></tpl>',
								'<tpl if="status==\'中止\'"><span style="color:red">中止</span></tpl>',
							'</li>',
            '</tpl>',
            '</ul>',
          '</tpl>',
          '</ul>',
          '<a target="_blank" href="http://www.tepco.co.jp/cc/press/index11-j.html">詳細は東京電力のサイトをご確認ください</a>',  
        '</div>'].join(''),

  scroll: 'vertical',

  initComponent: function(){
    this.dockedItems = [{
      dock: 'top',
      xtype: 'toolbar',
      title: '詳細',
      items: [{
        xtype: 'button',
        ui: 'back',
        text: '地図',
        handler: this.onBack,
        scope: this
      },{
        xtype: 'spacer'
      },{
        xtype: 'button',
				itemId: 'savebutton',
        ui: 'confirm',
        text: '場所を保存',
        handler: this.onSave,
        scope: this
      },{
        xtype: 'button',
				itemId: 'removebutton',
        ui: 'decline',
        text: '場所を解除',
				hidden: true,
        handler: this.onRemove,
        scope: this
      }]
    }];

    this.addEvents('back','save','remove');
    BO.Info.superclass.initComponent.call(this);

		var docked = this.getDockedItems()[0];
		this.saveBtn = docked.down('#savebutton');
		this.removeBtn = docked.down('#removebutton');
  },

  onBack: function(){
    this.fireEvent('back', this);
  },

  onSave: function(){
    this.fireEvent('save', this);
		this.toggleButton();
  },

  onRemove: function(){
    this.fireEvent('remove', this);
		this.toggleButton();
  },

	toggleButton: function(){
		if(this.saveBtn.isVisible()){
			this.saveBtn.hide();
			this.removeBtn.show();
		}else{
			this.saveBtn.show();
			this.removeBtn.hide();
		}
	},

	resetButton: function(){
		this.saveBtn.show();
		this.removeBtn.hide();
	}
});

Ext.reg('boinfo',BO.Info);
