/*
	usrcollection [
		{id:  , loc:  }
	]
	
*/

var User = {};
var db;
var bluetoothlc = require('./bluetoothlc');
var usrcollec = [
	{
		id: 'Jiahao',
		loc: 0
	},
	{
		id: 'Zhongming',
		loc: 1
	},
	{
		id: 'Sherman',
		loc: 2
	}
]


//debugging usage
User.collection = usrcollec;
User.setUsrLoc = function(uid, loc) {
	for (var i = 0; i < usrcollec.length; i++) 
		if (usrcollec[i].id == uid)
			usrcollec[i].loc = loc;
}

User.checkId = function(uid) {
	return true;
}

/*
	@param: user id
	return: user location id
*/
User.getUserLoc = function(uid) {

	for (var i = 0; i < usrcollec.length; i++) 
		if (usrcollec[i].id == uid)
			return usrcollec[i].loc;

	return null;
}

/*
	update user location.
	@param: uid: usr id, rssis: input rssis JSON string
*/
User.updateUser = function(uid, rssis) {
	var loc = bluetoothlc.getLoc(rssis);
	for (var i = 0; i < usrcollec.length; i++) 
		if (usrcollec[i].id == uid)
			usrcollec[i].loc = loc;
	console.log(usrcollec);
	return loc;
}

module.exports = User;