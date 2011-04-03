Ext.ns("BO");Ext.regModel("MyLocation",{fields:[{name:"id",type:"int"},{name:"longitude",type:"float"},{name:"latitude",type:"float"},{name:"group",type:"int"},{name:"subgroup",type:"string"},{name:"address",type:"string"}]});Ext.regStore("MyLocations",{model:"MyLocation",proxy:{type:"localstorage",id:"mylocation"}});Ext.ns("BO");BO.Data={calcCount:5,groups:5,subgroups:["A","B","C","D","E"],zeroDay:new Date(2011,2,15),zeroDay2:new Date(2011,2,26),dataSource:[["計画停電情報（東京電力）","http://www.tepco.co.jp/index-j.html","2011/03/21"],["栃木県（東京電力、Excel形式）","http://www.tepco.co.jp/images/tochigi.xls","2011/03/29"],["茨城県（現在対象地域無し）","http://www.tepco.co.jp/images/ibaraki.xls","2011/03/25"],["群馬県（東京電力、Excel形式）","http://www.tepco.co.jp/images/gunma.xls","2011/03/29"],["千葉県（東京電力、Excel形式）","http://www.tepco.co.jp/images/chiba.xls","2011/04/01"],["神奈川県（東京電力、Excel形式）","http://www.tepco.co.jp/images/kanagawa.xls","2011/03/29"],["東京都（東京電力、Excel形式）","http://www.tepco.co.jp/images/tokyo.xls","2011/04/01"],["埼玉県（東京電力、Excel形式）","http://www.tepco.co.jp/images/saitama.xls","2011/04/01"],["山梨県（東京電力、Excel形式）","http://www.tepco.co.jp/images/yamanashi.xls","2011/03/29"],["静岡県（東京電力、Excel形式）","http://www.tepco.co.jp/images/numazu.xls","2011/03/29"],["他の検索サイト（ITmedia）","http://www.itmedia.co.jp/news/articles/1103/15/news066.html","2011/03/18"]],slots:["18:20-22:00","15:20-19:00","12:20-16:00","09:20-13:00","06:20-10:00"],slots2:["16:50-20:30","13:50-17:30"],zeroDaySlots:[1,0,4,3,2],zeroDaySlots2:[3,2,1,0,4],zeroDay2Offset0:[1,2,3,4,0],zeroDay2Offset1:[2,3,4,0,1],getDaySlot:function(e,b){var f=b.getDayOfYear()-this.zeroDay.getDayOfYear(),a=this.zeroDaySlots[e],c=this.groups,d=(f+a)%c;return this.slots[d]},getDaySlot2:function(e,b){var f=b.getDayOfYear()-this.zeroDay.getDayOfYear(),a=this.zeroDaySlots2[e],c=this.groups,d=(f+a)%c;return this.slots2[d]||null},getSubDaySlot:function(d,c,b,a){if(b===this.slots2[0]){return this.getSubDaySlot0(d,c,b,a)}else{if(b===this.slots2[1]){return this.getSubDaySlot1(d,c,b,a)}}},getSubDaySlot0:function(i,f,e,b){var h=i.group-1,a=i.subgroup,j=b.getDayOfYear()-this.zeroDay2.getDayOfYear()-this.zeroDay2Offset0[h],d=this.subgroups.indexOf(a),c=Math.floor(j/this.groups),k=d-c;k=k<0?k+this.subgroups.length:k;return k<3?f:e},getSubDaySlot1:function(i,f,e,b){var h=i.group-1,a=i.subgroup,j=b.getDayOfYear()-this.zeroDay2.getDayOfYear()-this.zeroDay2Offset1[h],d=this.subgroups.indexOf(a),c=Math.floor(j/this.groups),k=d-c;k=k<0?k+this.subgroups.length:k;return k<3?f:e},getSlot:function(l){var o=new Date(Math.max(new Date(),this.zeroDay)),m=[],p,h,f,n=[],c;for(var b=0;b<l.length;b++){for(var e=0;e<this.calcCount;e++){p=o.add(Date.DAY,e);h=this.getDaySlot(l[b].group-1,p);f=this.getDaySlot2(l[b].group-1,p);if(h&&f){h=this.getSubDaySlot(l[b],h,f,p)}c="未定";if(l[b].status){for(var a=0;a<l[b].status.length;a++){if(p.toDateString()===(new Date(l[b].status[a].date)).toDateString()){c=l[b].status[a].status;break}}}m.push({day:p,slot:h,status:c})}n.push({group:l[b].group,subgroup:l[b].subgroup,slots:m});m=[]}return n}};Ext.ns("BO");BO.Info=Ext.extend(Ext.Panel,{tpl:['<div class="boinfo">','<span class="add">住所：{address}</span><br>','<span id="timezone">時間帯：</span>',"<ul>",'<tpl for="detail">','<li class="h2s">グループ：{group}{subgroup}</li>','<ul class="rabox">','<tpl for="slots">','<li>{day:date("m/d")}：{slot}：','<tpl if="status==\'未定\'"><span style="color:gray">未定</span></tpl>','<tpl if="status==\'実施\'"><span style="color:blue">実施</span></tpl>','<tpl if="status==\'中止\'"><span style="color:red">中止</span></tpl>',"</li>","</tpl>","</ul>","</tpl>","</ul>",'<a target="_blank" href="http://www.tepco.co.jp/cc/press/index11-j.html">詳細は東京電力のサイトをご確認ください</a>',"</div>"].join(""),scroll:"vertical",initComponent:function(){this.dockedItems=[{dock:"top",xtype:"toolbar",title:"詳細",items:[{xtype:"button",ui:"back",text:"地図",handler:this.onBack,scope:this},{xtype:"spacer"},{xtype:"button",itemId:"savebutton",ui:"confirm",text:"場所を保存",handler:this.onSave,scope:this},{xtype:"button",itemId:"removebutton",ui:"decline",text:"場所を解除",hidden:true,handler:this.onRemove,scope:this}]}];this.addEvents("back","save","remove");BO.Info.superclass.initComponent.call(this);var a=this.getDockedItems()[0];this.saveBtn=a.down("#savebutton");this.removeBtn=a.down("#removebutton")},onBack:function(){this.fireEvent("back",this)},onSave:function(){this.fireEvent("save",this);this.toggleButton()},onRemove:function(){this.fireEvent("remove",this);this.toggleButton()},toggleButton:function(){if(this.saveBtn.isVisible()){this.saveBtn.hide();this.removeBtn.show()}else{this.saveBtn.show();this.removeBtn.hide()}},resetButton:function(){this.saveBtn.show();this.removeBtn.hide()}});Ext.reg("boinfo",BO.Info);Ext.ns("BO");BO.Source=Ext.extend(Ext.Panel,{viewTpl:'<div><tpl for="."><div class="bodetail"><a href="{url}" target="_blank" class="url">{pref}</a><br><span class="update">最終更新日：{update:date("Y/m/d")}</span></div></tpl></div>',viewSelector:"div.bodetail",initComponent:function(){this.layout="fit";this.dockedItems=[{dock:"top",xtype:"toolbar",title:"情報源"}];this.items=[{xtype:"dataview",tpl:this.viewTpl,itemSelector:this.viewSelector,store:this.store}];BO.Source.superclass.initComponent.call(this)}});Ext.reg("bosource",BO.Source);Ext.ns("BO");BO.Notice=Ext.extend(Ext.Panel,{modal:true,floating:true,centered:true,width:300,height:250,scroll:"vertical",styleHtmlContent:true,tpl:['<div class="bonotice">',"<span>住所：</span>","<ul>","<li>{address}</li>","</ul>","<span>今日の予定：</span>","<ul>",'<tpl for="group">',"<li>{group}{subgroup}：{slot}：",'<tpl if="status==\'未定\'"><span style="color:gray">未定</span></tpl>','<tpl if="status==\'実施\'"><span style="color:blue">実施</span></tpl>','<tpl if="status==\'中止\'"><span style="color:red">中止</span></tpl>',"</li>","</tpl>","</ul>","</div>"].join(""),scroll:"vertical",initComponent:function(){this.dockedItems=[{dock:"top",xtype:"toolbar",title:(new Date()).format("n月j日"),items:[{xtype:"spacer"},{text:"閉じる",ui:"decline",handler:this.onClose,scope:this}]}];BO.Notice.superclass.initComponent.call(this)},onClose:function(){this.destroy()}});Ext.reg("bonotice",BO.Notice);Ext.ns("BO");BO.Map=Ext.extend(Ext.form.FormPanel,{bodyPadding:0,isMapReady:false,initComponent:function(){this.layout="fit";this.items=[{xtype:"map",mapOptions:{zoom:15,mapTypeControl:false,streetViewControl:false},listeners:{maprender:function(){this.isMapReady=true;this.fireEvent("mapready")},scope:this}}];this.dockedItems=[{xtype:"toolbar",dock:"top",defaults:{ui:"plain",iconMask:true},items:[{xtype:"searchfield",placeHolder:"住所や駅名で検索"},{xtype:"spacer"},{iconCls:"locate",handler:this.onLocate,scope:this}]}];BO.Map.superclass.initComponent.call(this);this.addEvents("addressfound","locationfound","groupfound","infowindowtap","mapready");this.map=this.down("map");this.search=this.getDockedItems()[0].down("searchfield");this.search.on("action",this.onGeocode,this)},initLocation:function(){this.onLocate()},onLocate:function(){var a=this.mask,c="現在地取得中";if(!a){a=this.mask=new Ext.LoadMask(Ext.getBody(),{msg:c})}else{c.msg}a.show();var b=this.geo;if(!b){b=this.geo=new Ext.util.GeoLocation({autoUpdate:false,timeout:30000})}b.updateLocation(this.onLocationUpdate,this)},onLocationUpdate:function(a){if(this.mask){this.mask.hide()}if(!a){alert("現在地が取得できませんでした。GPSがオフになっていませんか？地図上のピンを指で現在地に動かしてください。");a=new Ext.util.GeoLocation();a.longitude=139.75082825128175;a.latitude=35.68091903087664}this.setLocation(a);this.addMarker(a);this.fireEvent("locationfound",a);a.callback=this.onAddressFound;this.findAddress(a)},onGeocode:function(a){var b=a.getValue();if(b){this.findLocation({address:b,findAddress:true,callback:this.onAddressFound})}},setLocation:function(a){var b=window.google.maps,d=new b.LatLng(a.latitude,a.longitude),c=this.map.map;c.setCenter(d)},getMarkerLocation:function(){var a=this.marker,b;if(!a){return null}else{b=a.getPosition();return{latitude:b.lat(),longitude:b.lng()}}},addMarker:function(b){var d=this,c=window.google.maps,f=new c.LatLng(b.latitude,b.longitude),e=d.map.map,a=d.marker;if(!a){a=d.marker=new c.Marker({map:e,position:f,draggable:true,clickable:true});c.event.addListener(a,"click",function(){d.onMarkerClick.call(d)});c.event.addListener(a,"dragend",function(){d.onMarkerDragend.call(d)});c.event.addListener(a,"dragstart",function(){d.onMarkerDragstart.call(d)})}else{a.setPosition(f)}},onMarkerClick:function(){var d=this,c=window.google.maps,e=d.map.map,a=d.marker,f,b=this.getInfoWindow(a);f=a.getPosition();b.setPosition(f);b.open(e,a)},onMarkerDragend:function(){var a=this.marker,b=a.getPosition();this.findAddress({latitude:b.lat(),longitude:b.lng(),callback:this.onAddressFound})},onMarkerDragstart:function(){if(this.iw){this.iw.close()}},getGeocoder:function(){var a=this.geocoder;if(!a){a=this.geocoder=new window.google.maps.Geocoder()}return a},findLocation:function(b){var e=this,c=window.google.maps,g=e.map.map,a=e.marker,f=e.getGeocoder(),d;if(!b.address){return}f.geocode({address:b.address},function(h){var j,i;if(h&&Ext.isArray(h)&&h.length>0){h=h[0]}j=h.geometry.location;g.setCenter(j);a.setPosition(j);if(b.findAddress===true){i={latitude:j.lat(),longitude:j.lng()};if(b.callback){i.callback=b.callback}e.findAddress(i)}})},findAddress:function(b){var e=this,c=window.google.maps,g=e.map.map,f=e.getGeocoder(),d;if(!b.latitude||!b.longitude){return}d={location:new c.LatLng(b.latitude,b.longitude)};var a=this.mask,h="詳細情報取得中";if(!a){a=this.mask=new Ext.LoadMask(Ext.getBody(),{msg:h})}else{a.msg=h}a.show();f.geocode(d,function(i){e.fireEvent("addressfound",i);if(b.callback&&Ext.isFunction(b.callback)){b.callback.call(b.scope||e,i)}else{a.hide()}})},onAddressFound:function(f){var c=[],e,b="日本, ",g;if(Ext.isArray(f)&&f.length>0){for(var d=0,a=f.length;d<a;d++){e=f[d].formatted_address;g=e.indexOf(b);if(g>-1){c.push(e.slice(g+b.length))}}this.findGroup(c)}else{if(this.mask){this.mask.hide()}alert("住所の取得に失敗しました")}},getInfoWindow:function(a){var b=this.iw;if(!b){b=this.iw=new window.google.maps.InfoWindow({position:a.getPosition()})}return b},setInfoWindowContent:function(b,d,c){var e=this.getInfoWindow(c||this.marker),g=new Ext.Element(document.createElement("div")),h=[];if(b===false){g.dom.innerHTML="計画停電対象外の地域です。"}else{for(var f=0,a=b.length;f<a;f++){h.push(b[f].group+b[f].subgroup)}g.addCls("infowindow");g.dom.innerHTML=d+"<br/>グループ："+h.join(",");this.mon(g,"tapstart",function(){g.addCls("infowindow_pressed")});this.mon(g,"tap",function(){g.removeCls("infowindow_pressed");this.fireEvent("infowindowtap",this)},this)}e.setContent(g.dom)},findGroup:function(e){var c=window.google.maps,f=this.map.map,a=this.marker,b=this.getInfoWindow(a),d;Ext.Ajax.request({url:"search.json",params:{query:Ext.encode(e)},success:function(g){if(this.mask){this.mask.hide()}g=Ext.decode(g.responseText);if(g.group&&g.group.length>0){this.setInfoWindowContent(g.group,g.address);b.open(f,a);this.fireEvent("groupfound",g.group,g.address)}else{this.setInfoWindowContent(false);alert("停電の範囲外かデータが存在しません")}},failure:function(g){if(this.mask){this.mask.hide()}alert("通信エラーです")},scope:this})}});Ext.reg("bomap",BO.Map);Ext.ns("BO");BO.App=Ext.extend(Ext.TabPanel,{notified:false,fullscreen:true,tabBar:{dock:"bottom",ui:"light",layout:{pack:"center"}},locationInfo:{},initComponent:function(){Ext.regModel("InfoSource",{fields:[{name:"pref"},{name:"url"},{name:"update",type:"date"}]});var a=new Ext.data.ArrayStore({model:"InfoSource",data:BO.Data.dataSource});this.items=[{xtype:"bomap",title:"地図",iconCls:"maps"},{xtype:"boinfo",title:"詳細",iconCls:"info"},{xtype:"bosource",title:"情報源",iconCls:"action",store:a},{xtype:"panel",scroll:"vertical",html:['<div class="tbhelp">','<h1 class="h2q">お知らせ</h1>','<p class="howto box">計画停電GPSがiPhoneアプリになりました！AppStoreで「停電チェッカー」で検索するかか<a href="http://itunes.apple.com/us/app/id428809827?mt=8" target="_blank">こちらをクリック</a>してください。</p>','<h1 class="h2q">使い方１</h1>','<p class="howto box">ピンをドラッグドロップ（指で押さえて移動）することでその場所の住所と停電グループが分かります。</p>','<h1 class="h2q">使い方２</h1>','<p class="howto box">地図上の吹き出しに表示された文字をタップすることで時間帯情報が表示されます（または画面下の「詳細」アイコンをタップしてください。</p>','<h1 class="h2q">注意</h1>','<p class="caution box">地域により複数のグループが存在している場合があります。</p>','<h1 class="h2q">最終更新</h1>','<p class="update box">2011/04/03 11:55</p>',"</div>"].join(""),iconCls:"more",dockedItems:[{xtype:"toolbar",dock:"top",title:"使い方"}],title:"使い方"},{xtype:"panel",scroll:"vertical",html:['<div class="tbteam">','<h1 class="h2q">Twitter</h1>','<p class="box"><a href="http://twitter.com/teidengps" target="_blank">@teidengps</a></p>','<h1 class="h2q">Team</h1>','<ul class="rabox">',"<li>@bossyooann</li>","<li>@jishiha</li>","<li>@kabaken</li>","<li>@kotsutsumi</li>","<li>@monoooki </li>","<li>@naotori</li>","</ul><br>",'<h1 class="h2q">Special Thanks to</h1>','<p class="box">さくらインターネット</p>','<p class="box">つくる社LLC</p>','<h1 class="h2q">Contact</h1>','<p class="box">表示データに不具合、間違いがございましたら、@naotoriまでTwitterでご連絡ください</p>',"</div>"].join(""),iconCls:"team",dockedItems:[{xtype:"toolbar",dock:"top",title:"チーム"}],title:"チーム"}];BO.App.superclass.initComponent.call(this);this.info=this.down("boinfo");this.map=this.down("bomap");this.map.on({groupfound:this.onGroupFound,infowindowtap:this.onInfoWindowTap,scope:this});this.info.on({back:function(){this.setActiveItem(0,{type:"slide",direction:"right"})},save:this.onLocationSave,remove:this.onLocationRemove,scope:this});this.initLocation()},initLocation:function(){var c=Ext.StoreMgr.get("MyLocations"),e=this,f=e.map,d;c.load();d=c.getCount();if(d>0){var h=c.getAt(0),g={latitude:h.get("latitude"),longitude:h.get("longitude")},b=h.get("address");this.info.toggleButton();function a(){f.setLocation(g);f.addMarker(g);f.findGroup([b])}if(f.isMapReady){a()}else{f.on("mapready",a,this,{single:true})}}else{f.initLocation()}},onLocationSave:function(){var d=Ext.StoreMgr.get("MyLocations"),f=this,g=f.map,h=g.getMarkerLocation(),b=f.locationInfo.group,c=f.locationInfo.address;d.proxy.clear();d.load();for(var e=0,a=b.length;e<a;e++){d.add({latitude:h.latitude,longitude:h.longitude,address:c,group:b[e].group,subgroup:b[e].subgroup})}d.sync()},onLocationRemove:function(){var a=Ext.StoreMgr.get("MyLocations");a.proxy.clear();a.load();a.sync()},onGroupFound:function(f,c){var j=BO.Data.getSlot(f),b=j.length,d=[],e,h;Ext.apply(this.locationInfo,{group:f,address:c});this.info.update({address:c,detail:j});this.info.resetButton();if(this.notified===false){for(e=0;e<b;e++){d.push({group:j[e].group,subgroup:j[e].subgroup,slot:j[e].slots[0].slot,status:j[e].slots[0].status})}h=new BO.Notice();h.update({address:c,group:d});h.show("pop");this.notified=true}},onInfoWindowTap:function(){this.setActiveItem(1)}});Ext.get("AN-sObj-stage").setStyle({visibility:"hidden"});Ext.setup({fullscreen:true,icon:"icon.png",phoneStartupScreen:"ps.png",onReady:function(){new BO.App()}});