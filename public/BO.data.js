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
						// SafariではYY-mm-dd形式がInvalidになるため修正（2011/04/04）
						if(day.toDateString() === (new Date(g[j].status[k].date.replace(/-/g, "/"))).toDateString()){
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
