/*
	map: {childs:[null,null,null,null], type: 'r', 'w', }
		childs[i]: null/integer
	info: ['','','']
	
	Note: all calls coming in should use id 
			every node is enforced to have no more than 4 children
			both info and map have their index correspond to their id number
*/


var Route = {};
var db;
var map =[
		{
			childs: [1,4,null,null],
			type: 'w'
		},	
		{
			childs: [null,2,0,null],
			type: 'w'
		},
		{
			childs: [null,null,3,1],
			type: 'w'
		},
		{
			childs: [2,null,4,null],
			type: 'w'
		},
		{
			childs: [3,null,null,0],
			type: 'r'
		}

];
var info = [
			'jiahao cpt',
			'zhongming cpt',
			'weiling cpt',
			'sherman cpt',	
			'zhongming\'s private room'
		]


Route.checkloc = function(loc) {
	return true;
}

/*
	@param: location id
	return: if room true
*/
Route.isRoom = function(loc) {
		return map[loc].type == 'r';
}

/*
	Perform BFS search on the map
	@param: current location id, target location id -- guaranteed not be the same
	return: the neighbor location id of cur which you will go next
*/
Route.BFS = function(cur, target) {
    var len = map.length;
    var visit = new Array();
    for (var i = 0; i < len; i++)
        visit.push(-1);
    var queue = [], tmp;
    queue.push(cur);
    visit[cur] = cur;
    var flag = false;

    while (queue.length > 0) {

      tmp = queue.shift();
      if (tmp == target)  break;
      for (var j = 0; j < 4; j++) {
        var c = map[tmp].childs[j];
        if (c != null && visit[c] == -1) {
            queue.push(c);
            visit[c] = tmp;
          }
      }
    }
    var prev;
    while (tmp != cur) {
        prev = tmp;
        tmp = visit[tmp];
    }
    return prev;
}

/*
	@param: location id
	return: location information for suggestion
*/
Route.getRoomInfo = function(loc) {
	return info[loc];
} 

/*
	@param: master: location id; slave: another id -- guaranteed that they are neighbors
	return: the position index of the slave
*/
Route.nb = function(master, slave) {
	for (var j = 0; j < 4; j++)
		if (map[master].childs[j] == slave)
			return j;
	return null;
}

/*
	Get direction suggestion
	@param: current loc id, prev loc id, the neigbour next your are supposed to go!
	return: the actual suggestion string.
*/
Route.getTurn = function(cur, prev, tn) {
	var sg = "";
	if (prev == -1)	{	//fresh start 
		sg = "FRESH START: plz find the following checkpoint -- " + info[tn];
		return sg;
	}
	var pi = null, ti = this.nb(cur, tn);
	if ((pi = this.nb(cur,prev)) == null) {
		console.error('INITIALIZE INFER TECHONOLOGY...')
		//infer() --> suggestion
		return "PREV NOT NEIGBOR, NEED INFERING";
	}
	switch((ti - pi + 4) % 4) {
		case 1: sg = "turn left"; break;
		case 2: sg = "go straight down"; break;
		case 3: sg = "turn right"; break;
		default: console.log("err: direction go backwards!!!")
	}
	return sg;
}
module.exports = Route;