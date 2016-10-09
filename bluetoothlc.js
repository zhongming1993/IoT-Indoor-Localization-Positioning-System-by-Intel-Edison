/*
	algorithm to calculate location beased on RSSI
*/
var Bluetoothlc = {};
var info;
/*
	Get user location 
	@param: rssis: JSON list of {MAC: , RSSI: }
	return: the location id
*/
/*
	Check sanity of RSSI
	@param: rssis: the same as above
	return: if the rssis signal is in the right format
*/



//debugging usage
Bluetoothlc.loc_debug = 0;
Bluetoothlc.setLoc = function(val) {
	this.loc_debug = val;
}

Bluetoothlc.getLoc = function(rssis) {
	return this.loc_debug;
}

Bluetoothlc.checkRSSI = function(rssis) {
	return true;
}
module.exports = Bluetoothlc; 

