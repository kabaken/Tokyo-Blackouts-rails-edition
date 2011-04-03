Ext.ns('BO');

Ext.regModel('MyLocation',{
	fields: [
		{name: 'id', type: 'int'},
		{name: 'longitude', type: 'float'},
		{name: 'latitude', type: 'float'},
		{name: 'group', type: 'int'},
		{name: 'subgroup', type: 'string'},
		{name: 'address', type: 'string'}
	]
});

Ext.regStore('MyLocations',{
	model: 'MyLocation',
	proxy: {
		type: 'localstorage',
		id: 'mylocation'
	}
});

Ext.ns('BO');

BO.Data = {
  calcCount: 5,
  groups: 5,
  subgroups : ['A','B','C','D','E'],

  zeroDay: new Date(2011,2,15),
  zeroDay2: new Date(2011,2,26),

  dataSource: [
    ['計画停電情報（東京電力）','http://www.tepco.co.jp/index-j.html','2011/03/21'],
    ['栃木県（東京電力、Excel形式）','http://www.tepco.co.jp/images/tochigi.xls','2011/03/29'],
    ['茨城県（現在対象地域無し）','http://www.tepco.co.jp/images/ibaraki.xls','2011/03/25'],
    ['群馬県（東京電力、Excel形式）','http://www.tepco.co.jp/images/gunma.xls','2011/03/29'],
    ['千葉県（東京電力、Excel形式）','http://www.tepco.co.jp/images/chiba.xls','2011/04/01'],
    ['神奈川県（東京電力、Excel形式）','http://www.tepco.co.jp/images/kanagawa.xls','2011/03/29'],
    ['東京都（東京電力、Excel形式）','http://www.tepco.co.jp/images/tokyo.xls','2011/04/01'],
    ['埼玉県（東京電力、Excel形式）','http://www.tepco.co.jp/images/saitama.xls','2011/04/01'],
    ['山梨県（東京電力、Excel形式）','http://www.tepco.co.jp/images/yamanashi.xls','2011/03/29'],
    ['静岡県（東京電力、Excel形式）','http://www.tepco.co.jp/images/numazu.xls','2011/03/29'],
    ['他の検索サイト（ITmedia）','http://www.itmedia.co.jp/news/articles/1103/15/news066.html','2011/03/18']
  ],

  slots: [
    "18:20-22:00", 
    "15:20-19:00",  
    "12:20-16:00",
    "09:20-13:00",  
    "06:20-10:00"  
  ],

  slots2: [
    "16:50-20:30", 
    "13:50-17:30" 
  ],

  zeroDaySlots: [1,0,4,3,2],
  zeroDaySlots2: [3,2,1,0,4],

  zeroDay2Offset0: [1,2,3,4,0],
  zeroDay2Offset1: [2,3,4,0,1],

  getDaySlot: function(group, date){
    var days = date.getDayOfYear() - this.zeroDay.getDayOfYear(),
        zeroDaySlot = this.zeroDaySlots[group], slotCount = this.groups,
        add = (days+zeroDaySlot) % slotCount;

    return this.slots[add];
  },

  getDaySlot2: function(group, date){
    var days = date.getDayOfYear() - this.zeroDay.getDayOfYear(),
        zeroDaySlot = this.zeroDaySlots2[group], slotCount = this.groups,
        add = (days+zeroDaySlot) % slotCount;

    return this.slots2[add] || null;
  },

  getSubDaySlot: function(group, slot1, slot2, date){
    if(slot2 === this.slots2[0]){
      return this.getSubDaySlot0(group, slot1, slot2, date);
    }else if(slot2 === this.slots2[1]){
      return this.getSubDaySlot1(group, slot1, slot2, date);
    }
  },

  getSubDaySlot0: function(group, slot1, slot2, date){
    var g = group.group-1, sub = group.subgroup, 
        days = date.getDayOfYear() - this.zeroDay2.getDayOfYear() - this.zeroDay2Offset0[g],
        suboffset = this.subgroups.indexOf(sub), offset = Math.floor(days / this.groups),
        result = suboffset - offset;

    result = result < 0 ? result + this.subgroups.length : result;

    return result < 3 ? slot1 : slot2;
  },

  getSubDaySlot1: function(group, slot1, slot2, date){
    var g = group.group-1, sub = group.subgroup, 
        days = date.getDayOfYear() - this.zeroDay2.getDayOfYear() - this.zeroDay2Offset1[g],
        suboffset = this.subgroups.indexOf(sub), offset = Math.floor(days / this.groups),
        result = suboffset - offset;

    result = result < 0 ? result + this.subgroups.length : result;

    return result < 3 ? slot1 : slot2;
  },


  getSlot: function(g){
    var d = new Date(Math.max(new Date(), this.zeroDay)), slots = [], day, slot1, slot2, ret = [], status;

    for(var j=0; j<g.length; j++){
      for(var i=0; i<this.calcCount; i++){
        day = d.add(Date.DAY,i);
        slot1 = this.getDaySlot(g[j].group-1,day);
        slot2 = this.getDaySlot2(g[j].group-1,day);

        if(slot1 && slot2){
          slot1 = this.getSubDaySlot(g[j], slot1, slot2, day);          
        }

				status = '未定';
				if(g[j].status){
					for(var k=0; k<g[j].status.length; k++){
						if(day.toDateString() === (new Date(g[j].status[k].date)).toDateString()){
							status = g[j].status[k].status;
							break;
						}
					}
				}

        slots.push({
          day: day,
          slot: slot1,
					status: status
        });
      }
      ret.push({
        group: g[j].group,
        subgroup: g[j].subgroup,
        slots: slots
      });
      slots = [];
    }
    return ret;
  }
};

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
//								'<tpl if="status==\'笑顔\'"><span style="color:red">笑顔</span></tpl>',
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
		this.hide();
//    this.destroy();
  }
});

Ext.reg('bonotice',BO.Notice);

Ext.ns('BO');

BO.Map = Ext.extend(Ext.form.FormPanel,{
  bodyPadding: 0,
	isMapReady: false,

  initComponent: function(){
    this.layout = 'fit';
    this.items = [{
      xtype: 'map',
      mapOptions: {
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false
      },
			listeners: {
				maprender: function(){
					this.isMapReady = true;
					this.fireEvent('mapready');
				},
				scope: this
			}
    }];
    this.dockedItems = [{
      xtype: 'toolbar',
      dock: 'top',
      defaults: {
        ui: 'plain',
        iconMask: true
      },
      items: [{
        xtype: 'searchfield',
        placeHolder: '住所や駅名で検索'
      },{
        xtype: 'spacer'  
      },{
        iconCls: 'locate',
        handler: this.onLocate,
        scope: this
      }]
    }];

    BO.Map.superclass.initComponent.call(this);

    this.addEvents('addressfound', 'locationfound', 'groupfound', 'infowindowtap', 'mapready');
    this.map = this.down('map');

    this.search = this.getDockedItems()[0].down('searchfield');
    this.search.on('action', this.onGeocode, this);
  },

	initLocation: function(){
		this.onLocate();	
	},

  onLocate: function(){
    var mask = this.mask, msg = "現在地取得中";

    if(!mask){
      mask = this.mask = new Ext.LoadMask(Ext.getBody(), {msg:msg});
    }else{
      msg.msg;
    }

    mask.show();

    var geo = this.geo;
    if(!geo){
      geo = this.geo = new Ext.util.GeoLocation({
        autoUpdate: false,
        timeout: 30000
      });
    }

    geo.updateLocation(this.onLocationUpdate,this);
  },

  onLocationUpdate: function(g){
    if(this.mask){ this.mask.hide(); }
    if(!g){ 
      alert('現在地が取得できませんでした。GPSがオフになっていませんか？地図上のピンを指で現在地に動かしてください。'); 
      g = new Ext.util.GeoLocation();
      g.longitude = 139.75082825128175;
      g.latitude = 35.68091903087664;
    }

    this.setLocation(g);
    this.addMarker(g);

    this.fireEvent('locationfound', g);

    g.callback = this.onAddressFound;

    this.findAddress(g);
  },

  onGeocode: function(field){
    var val = field.getValue();

    if(val){
      this.findLocation({ 
        address: val,
        findAddress: true,
        callback: this.onAddressFound
      });
    }
  },

  setLocation: function(cfg){
    var ggl = window.google.maps, loc = new ggl.LatLng(cfg.latitude,cfg.longitude), map = this.map.map;
    map.setCenter(loc);
  },

	getMarkerLocation: function(){
		var m = this.marker, loc;

		if(!m){
			return null; 
		}else{
			loc = m.getPosition();
			return {
				latitude: loc.lat(),
				longitude: loc.lng()
			};
		}
		
	},

  addMarker: function(cfg){
    var me = this, ggl = window.google.maps, loc = new ggl.LatLng(cfg.latitude,cfg.longitude), map = me.map.map, marker = me.marker;

    if(!marker){
      marker = me.marker = new ggl.Marker({
        map: map,
        position: loc,
        draggable: true,
        clickable: true
      });

      ggl.event.addListener(marker, 'click', function(){
        me.onMarkerClick.call(me);
      });

      ggl.event.addListener(marker, 'dragend', function(){
        me.onMarkerDragend.call(me);
      });

      ggl.event.addListener(marker, 'dragstart', function(){
        me.onMarkerDragstart.call(me);
      });
/*
      ggl.event.addListener(map, 'click', function(e){
        marker.setPosition(e.latLng);
        me.onMarkerDragend.call(me);
      });
*/
    }else{
      marker.setPosition(loc);
    }
  },

  onMarkerClick: function(){
    var me = this, ggl = window.google.maps, map = me.map.map, marker = me.marker, loc, iw = this.getInfoWindow(marker);
    loc = marker.getPosition();

    iw.setPosition(loc);
    iw.open(map,marker);
  },

  onMarkerDragend: function(){
    var marker = this.marker, loc = marker.getPosition();

    this.findAddress({
      latitude: loc.lat(),
      longitude: loc.lng(),
      callback: this.onAddressFound
    });
  },

  onMarkerDragstart: function(){
    if(this.iw){
      this.iw.close();
    }
  },

  getGeocoder: function(){
    var geocoder = this.geocoder;

    if(!geocoder){
      geocoder = this.geocoder = new window.google.maps.Geocoder();
    }

    return geocoder;
  },

  findLocation: function(cfg){
    var me = this, ggl = window.google.maps, map = me.map.map, marker = me.marker, geocoder = me.getGeocoder(),
        request;
        
    if(!cfg.address){ return; }
    
    geocoder.geocode({ address: cfg.address }, function(res){
      var loc, request;

      if(res && Ext.isArray(res) && res.length > 0){
        res = res[0];
      }

      loc = res.geometry.location;
      map.setCenter(loc);
      marker.setPosition(loc);

      if(cfg.findAddress === true){
        request = {
          latitude: loc.lat(),
          longitude: loc.lng()
        };

        if(cfg.callback){
          request.callback = cfg.callback;
        }

        me.findAddress(request);
      }
    });
  },

  findAddress: function(cfg){
    var me = this, ggl = window.google.maps, map = me.map.map, geocoder = me.getGeocoder(),
        request;
        
    if(!cfg.latitude || !cfg.longitude){ return; }

    request = { location: new ggl.LatLng(cfg.latitude,cfg.longitude) };

    var mask = this.mask, msg = "詳細情報取得中";

    if(!mask){
      mask = this.mask = new Ext.LoadMask(Ext.getBody(), {msg:msg});
    }else{
      mask.msg = msg;
    }

    mask.show();

    geocoder.geocode(request, function(res){
      me.fireEvent('addressfound', res);
      if(cfg.callback && Ext.isFunction(cfg.callback)){
        cfg.callback.call(cfg.scope || me, res);
      }else{
        mask.hide();
      }
    });
  },

  onAddressFound: function(res){
    var queries=[], tmp, trim = '日本, ', trim_index;
    
    if(Ext.isArray(res) && res.length > 0){
      for(var i=0, len=res.length; i<len; i++){
        tmp = res[i].formatted_address;
        trim_index = tmp.indexOf(trim);
        if(trim_index>-1){
          queries.push(tmp.slice(trim_index + trim.length));
        }
      }

      this.findGroup(queries);
    }else{
			if(this.mask){ this.mask.hide(); }
      alert("住所の取得に失敗しました");
    }
  },

	getInfoWindow: function(marker){
		var iw = this.iw;
    if(!iw){
      iw = this.iw = new window.google.maps.InfoWindow({
        position: marker.getPosition()
      });
    }
		
		return iw;
	},

	setInfoWindowContent: function(groups, address, marker){
		var iw = this.getInfoWindow(marker || this.marker),
				el = new Ext.Element(document.createElement('div')), groupString = [];

		if(groups===false){
			el.dom.innerHTML = '計画停電対象外の地域です。';	
		}else{
	    for(var i=0, len=groups.length; i<len; i++){
	      groupString.push(groups[i].group + groups[i].subgroup);   
	    }
	
	    el.addCls('infowindow');
	    el.dom.innerHTML = address + '<br/>' + 'グループ：' + groupString.join(',');
	
	    this.mon(el,'tapstart',function(){
	      el.addCls('infowindow_pressed');
	    });
	    this.mon(el,'tap',function(){
	      el.removeCls('infowindow_pressed');
	      this.fireEvent('infowindowtap', this);
	    }, this);
		}

    iw.setContent(el.dom);
	},

  findGroup: function(q){
    var ggl = window.google.maps, map = this.map.map, marker = this.marker, iw = this.getInfoWindow(marker), content;
    
    Ext.Ajax.request({
      url: 'search.json',
      params: {
        query: Ext.encode(q)
      },
      success: function(res){
				if(this.mask){ this.mask.hide(); }
        res = Ext.decode(res.responseText);
        if(res.group && res.group.length>0){
					this.setInfoWindowContent(res.group, res.address);
          iw.open(map, marker);

          this.fireEvent('groupfound', res.group, res.address);
        }else{
					this.setInfoWindowContent(false);
          alert("停電の範囲外かデータが存在しません");
        }
      },
      failure: function(res){
				if(this.mask){ this.mask.hide(); }
        alert("通信エラーです");
      },
      scope: this
    });
    
  }
});

Ext.reg('bomap', BO.Map);

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
          '<h1 class="h2q">お知らせ</h1>',
          '<p class="howto box">計画停電GPSがiPhoneアプリになりました！AppStoreで「停電チェッカー」で検索するかか<a href="http://itunes.apple.com/us/app/id428809827?mt=8" target="_blank">こちらをクリック</a>してください。</p>',
          '<h1 class="h2q">使い方１</h1>',
          '<p class="howto box">ピンをドラッグドロップ（指で押さえて移動）することでその場所の住所と停電グループが分かります。</p>',
          '<h1 class="h2q">使い方２</h1>',
          '<p class="howto box">地図上の吹き出しに表示された文字をタップすることで時間帯情報が表示されます（または画面下の「詳細」アイコンをタップしてください。</p>',
          '<h1 class="h2q">注意</h1>',
          '<p class="caution box">地域により複数のグループが存在している場合があります。</p>',
          '<h1 class="h2q">最終更新</h1>',
          '<p class="update box">2011/04/03 11:55</p>',
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
					'<h1 class="h2q">Twitter</h1>',
          '<p class="box"><a href="http://twitter.com/teidengps" target="_blank">@teidengps</a></p>',
          '<h1 class="h2q">Team</h1>',
          '<ul class="rabox">',
            '<li>@bossyooann</li>',
            '<li>@jishiha</li>',
            '<li>@kabaken</li>',
            '<li>@kotsutsumi</li>',
            '<li>@monoooki </li>',
            '<li>@naotori</li>',
          '</ul><br>',
          '<h1 class="h2q">Special Thanks to</h1>',
          '<p class="box">さくらインターネット</p>',
          '<p class="box">つくる社LLC</p>',
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

			var rec = store.getAt(0), 
					loc = { latitude: rec.get('latitude'), longitude: rec.get('longitude') },
					address = rec.get('address');

			this.info.toggleButton();

			function initMap(){
				map.setLocation(loc);
				map.addMarker(loc);
				map.findGroup([address]);
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
          slot: slot[i].slots[0].slot, // 今日
          status: slot[i].slots[0].status // 今日
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

// force=trueを与えることでPCでもスマートフォンモードを稼働
// それ以外はPCサイトに転送

/*
(function(){
  var q = window.location.search, force;
  if(q){
    q = q.substr(1);
    q = Ext.urlDecode(q);
    force = q['force'];
  }

  if(Ext.is.Desktop && force !== "true"){
    window.location = './index_pc.html';
  }
})();
*/

// スマートフォンサイトの稼働
Ext.get('AN-sObj-stage').setStyle({
	visibility: 'hidden'
});

Ext.setup({
  fullscreen: true,
  icon: 'icon.png',
	phoneStartupScreen: 'ps.png',
  onReady: function(){
    new BO.App();
  }
});




