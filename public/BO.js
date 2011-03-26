Ext.ns('BO');

BO.App = Ext.extend(Ext.TabPanel,{
	notified: false,
  fullscreen: true,
  tabBar: {
    dock: 'bottom',
    ui: 'light',
    layout: {
      pack: 'center'
    }
  },

  initComponent: function(){
		Ext.regModel('InfoSource',{
			fields: [
				{name: 'pref'},
				{name: 'url'},
				{name: 'update', type: 'date'}
			]
		});

		var store = new Ext.data.ArrayStore({
			model: 'InfoSource',
			data: BO.Data.dataSource 
		});

    this.items = [{
      xtype: 'bomap',
      title: '地図',
      iconCls: 'maps'
    },{
      xtype: 'boinfo',
      title: '詳細',
      iconCls: 'info'
    },{
      xtype: 'bosource',
      title: '情報源',
      iconCls: 'action',
			store: store 
		},{
			xtype: 'panel',
			html: ['<div class="tbhelp">',
					'<p class="howto">使い方１：ピンをドラッグドロップ（指で押さえて移動）することでその場所の住所と停電グループが分かります。</p>',
					'<p class="howto">使い方２：地図上の吹き出しに表示された文字をタップすることで時間帯情報が表示されます（または画面下の「詳細」アイコンをタップしてください。</p>',
					'<p class="caution">注意：地域により複数のグループが存在している場合があります。</p>',
					'<p class="update">最終更新：2011/03/21 16:15</p>',
				'</div>'].join(''), 
			iconCls: 'more',
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				title: '使い方'
			}],
			title: '使い方'
		},{
			xtype: 'panel',
			html: ['<div class="teamblackouts">',
					'<ul>',
						'<li>@bossyooann</li>',
						'<li>@kabaken</li>',
						'<li>@kotsutsumi</li>',
						'<li>@naotori</li>',
					'</ul><br>',
					'<span>Special Thanks to:</span><br><span>さくらインターネット</span>',
					'<p>表示データに不具合、間違いがございましたら、@naotoriまでTwitterでご連絡ください</p>',
				'</div>'].join(''), 
			iconCls: 'team',
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				title: 'Team'
			}],
			title: 'チーム'
		}];

    BO.App.superclass.initComponent.call(this);

    this.info = this.down('boinfo');
    this.map = this.down('bomap');

    this.map.on({
      groupfound: this.onGroupFound,
      infowindowtap: this.onInfoWindowTap,
      scope: this
    });

    this.info.on({
      back: function(){
        this.setActiveItem(0, {
          type: 'slide',
          direction: 'right'
        });  
      },
      scope: this
    });
  },

  onGroupFound: function(g,a){
		var slot = BO.Data.getSlot(g), len = slot.length, today = [], i, notice;

    this.info.update({
      address: a,
      detail: slot
    });

		if(this.notified === false){
			
			for(i=0; i<len; i++){
				today.push({
					group: slot[i].group,
					slot: slot[i].slots[0].slot
				});
			}

			notice = new BO.Notice();
			notice.update({
				address: a,
				group: today
			});

			notice.show('pop');	

			this.notified = true;
		}
  },

  onInfoWindowTap: function(){
    this.setActiveItem(1);
  }
});
