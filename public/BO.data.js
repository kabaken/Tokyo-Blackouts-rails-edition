Ext.ns('BO');

BO.Data = {
	groups: 5,

	zeroDay: new Date(2011,2,15),

	dataSource: [
		['他の検索サイト','http://www.itmedia.co.jp/news/articles/1103/15/news066.html','2011/03/18'],
		['計画停電情報','http://www.tepco.co.jp/index-j.html','2011/03/21'],
		['栃木県','http://www.tepco.co.jp/images/tochigi.xls','2011/03/19'],
		['茨城県','http://www.tepco.co.jp/images/ibaraki.xls','2011/03/16'],
		['群馬県','http://www.tepco.co.jp/images/gunma.xls','2011/03/19'],
		['千葉県','http://www.tepco.co.jp/images/chiba.xls','2011/03/20'],
		['神奈川県','http://www.tepco.co.jp/images/kanagawa.xls','2011/03/20'],
		['東京都','http://www.tepco.co.jp/images/tokyo.xls','2011/03/20'],
		['埼玉県','http://www.tepco.co.jp/images/saitama.xls','2011/03/18'],
		['山梨県','http://www.tepco.co.jp/images/yamanashi.xls','2011/03/19'],
		['静岡県','http://www.tepco.co.jp/images/numazu.xls','2011/03/18']
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

	getSlot: function(g){
		var d = new Date(Math.max(new Date(), this.zeroDay)), slots = [], day, slot1, slot2, ret = [];

		for(var j=0; j<g.length; j++){
			for(var i=0; i<this.groups; i++){
				day = d.add(Date.DAY,i);
				slot1 = this.getDaySlot(g[j]-1,day);
				slot2 = this.getDaySlot2(g[j]-1,day);
	
				slots.push({
					day: day,
					slot: slot1 + (slot2 ? ' & '+ slot2 : '')
				});
			}
			ret.push({
				group: g[j],
				slots: slots
			});
			slots = [];
		}
		return ret;
	}
};
