Ext.ns('BO');

BO.Map = Ext.extend(Ext.Panel,{
  initComponent: function(){
    this.layout = 'fit';
    this.items = [{
      xtype: 'map',
//      useCurrentLocation: true,
			mapOptions: {
				zoom: 15,
				mapTypeControl: false,
				streetViewControl: false
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
        xtype: 'spacer'  
      },{
        iconCls: 'locate',
        handler: this.onLocate,
        scope: this
      }]
    }];

    BO.Map.superclass.initComponent.call(this);

    this.addEvents('addressfound', 'locationfound', 'groupfound', 'infowindowtap');
    this.map = this.down('map');

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
//        allowHighAccuracy: true
        autoUpdate: false,
        timeout: 30000
      });
    }

    geo.updateLocation(this.onLocationUpdate,this);
  },

  onLocationUpdate: function(g){
    this.mask.hide();
    if(!g){ 
			alert('現在地が取得できませんでした。GPSがオフになっていませんか？地図上のピンを指で現在地に動かしてください。'); 
      g = new Ext.util.GeoLocation();
      g.longitude = 139.75082825128175;
      g.latitude = 35.68091903087664;
		}

    // debug
		/*
    if(!g){
      g = new Ext.util.GeoLocation();
      g.longitude = (139.3684954494629 + 139.44411228601075) / 2;
      g.latitude = (35.384739997054474 + 35.314085591494944) / 2;
    }
		*/
    // debug
    
    this.setLocation(g);
    this.addMarker(g);

    this.fireEvent('locationfound', g);

    this.findAddress(g);
  },

  setLocation: function(cfg){
    var ggl = window.google.maps, loc = new ggl.LatLng(cfg.latitude,cfg.longitude), map = this.map.map;
    map.setCenter(loc);
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
    var me = this, ggl = window.google.maps, map = me.map.map, marker = me.marker, loc, iw = this.iw;
    loc = marker.getPosition();

    iw.setPosition(loc);
    iw.open(map,marker);
  },

  onMarkerDragend: function(){
    var marker = this.marker, loc = marker.getPosition();

    this.findAddress({
      latitude: loc.lat(),
      longitude: loc.lng()
    });
  },

  onMarkerDragstart: function(){
    if(this.iw){
      this.iw.close();
    }
  },

  findAddress: function(cfg){
    var me = this, ggl = window.google.maps, loc = new ggl.LatLng(cfg.latitude,cfg.longitude), map = me.map.map,
        geocoder = me.geocoder;

    var mask = this.mask, msg = "詳細情報取得中";

    if(!mask){
      mask = this.mask = new Ext.LoadMask(Ext.getBody(), {msg:msg});
    }else{
      mask.msg = msg;
    }

    mask.show();

    if(!geocoder){
      geocoder = me.geocoder = new ggl.Geocoder();
    }

    geocoder.geocode({ location: loc }, function(res){
      me.fireEvent('addressfound', res);
      me.onAddressFound.call(me, res);
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
      this.mask.hide();
      alert("住所の取得に失敗しました");
    }
  },

  findGroup: function(q){
    var ggl = window.google.maps, map = this.map.map, iw = this.iw, marker = this.marker, content;
    
    if(!iw){
      iw = this.iw = new ggl.InfoWindow({
        position: marker.getPosition()
      });
    }

    Ext.Ajax.request({
      url: 'search.json',
      params: {
        query: Ext.encode(q)
      },
      success: function(res){
        this.mask.hide();
        res = Ext.decode(res.responseText);
        if(res.group && res.group.length>0){
          var el = new Ext.Element(document.createElement('div'));
          el.addCls('infowindow');
          el.dom.innerHTML = res.address + '<br/>' + 'グループ：' + res.group.join(',');

          this.mon(el,'tapstart',function(){
            el.addCls('infowindow_pressed');
          });
          this.mon(el,'tap',function(){
            el.removeCls('infowindow_pressed');
            this.fireEvent('infowindowtap', this);
          }, this);

          iw.setContent(el.dom);
          iw.open(map, marker);

          this.fireEvent('groupfound', res.group, res.address);
        }else{
          alert("停電の範囲外かデータが存在しません");
        }
      },
      failure: function(res){
        this.mask.hide();
        alert("通信エラーです");
      },
      scope: this
    });
    
  }
});

Ext.reg('bomap', BO.Map);
