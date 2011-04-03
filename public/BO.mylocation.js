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
