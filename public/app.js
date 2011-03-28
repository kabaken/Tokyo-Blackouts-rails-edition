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

