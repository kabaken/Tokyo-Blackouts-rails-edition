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
