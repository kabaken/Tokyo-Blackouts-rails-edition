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

  locationInfo: {},

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
      scroll: 'vertical',
      html: [
        '<div class="tbhelp">',
          '<h1 class="h2q">使い方１</h1>',
          '<p class="howto box">ピンをドラッグドロップ（指で押さえて移動）することでその場所の住所と停電グループが分かります。</p>',
          '<h1 class="h2q">使い方２</h1>',
          '<p class="howto box">地図上の吹き出しに表示された文字をタップすることで時間帯情報が表示されます（または画面下の「詳細」アイコンをタップしてください。</p>',
          '<h1 class="h2q">注意</h1>',
          '<p class="caution box">地域により複数のグループが存在している場合があります。</p>',
          '<h1 class="h2q">最終更新</h1>',
          '<p class="update box">2011/03/26 11:55</p>',
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
      scroll: 'vertical',
      html: [
        '<div class="tbteam">',
          '<h1 class="h2q">Team</h1>',
          '<ul class="rabox">',
            '<li>@bossyooann</li>',
            '<li>@kabaken</li>',
            '<li>@kotsutsumi</li>',
            '<li>@naotori</li>',
          '</ul><br>',
          '<h1 class="h2q">Special Thanks to</h1>',
          '<p class="box">さくらインターネット</p>',
          '<h1 class="h2q">Contact</h1>',
          '<p class="box">表示データに不具合、間違いがございましたら、@naotoriまでTwitterでご連絡ください</p>',
        '</div>'].join(''), 
      iconCls: 'team',
      dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        title: 'チーム'
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
      save: this.onLocationSave,
      remove: this.onLocationRemove,
      scope: this
    });

		this.initLocation();
  },

	initLocation: function(){
    var store = Ext.StoreMgr.get('MyLocations'), me = this, map = me.map, count;
		
		store.load();
		count = store.getCount();
	
		if(count > 0){

			var groups = [], rec = store.getAt(0), 
					loc = { latitude: rec.get('latitude'), longitude: rec.get('longitude') },
					address = rec.get('address');

			store.each(function(rec){
				groups.push({
					group: rec.get('group'),
					subgroup: rec.get('subgroup')
				});
			});

			this.onGroupFound(groups, address);
			this.info.toggleButton();
//			this.setActiveItem(1);

			function initMap(){
				map.setLocation(loc);
				map.addMarker(loc);
				map.setInfoWindowContent(groups, address);
			}

			if(map.isMapReady){
				initMap();
			}else{
				map.on('mapready',initMap, this, { single: true });	
			}

		}else{
			map.initLocation();		
		}
	},

  onLocationSave: function(){
    var store = Ext.StoreMgr.get('MyLocations'), me = this, map = me.map, loc = map.getMarkerLocation(), 
        groups = me.locationInfo.group, address = me.locationInfo.address;

    store.proxy.clear();
    store.load();

    for(var i=0, len=groups.length; i<len; i++){
			store.add({
				latitude: loc.latitude,
				longitude: loc.longitude,
				address: address,
				group: groups[i].group,
				subgroup: groups[i].subgroup
			});	
    }

		store.sync();
  },

  onLocationRemove: function(){
    var store = Ext.StoreMgr.get('MyLocations');
    store.proxy.clear();
    store.load();
		store.sync();
  },

  onGroupFound: function(g,a){
    var slot = BO.Data.getSlot(g), len = slot.length, today = [], i, notice;

    Ext.apply(this.locationInfo,{
      group: g,
      address: a
    });

    this.info.update({
      address: a,
      detail: slot
    });

		this.info.resetButton();

    if(this.notified === false){
      
      for(i=0; i<len; i++){
        today.push({
          group: slot[i].group,
          subgroup: slot[i].subgroup,
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
