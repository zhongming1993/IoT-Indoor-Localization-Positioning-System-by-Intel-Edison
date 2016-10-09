/*
  
  request param:
  request query param: 
    id: string user Id
    isNavi: true/false, if user is in navigation mode
    tId: in navigation mode, target id
    loc: integer indicate the current location id, -1 if just start navigation
    RSSIs: JSON string data containing the messured RSSI signal in the form: [{MAC: xxx, RSSI: xxx},{...}]
  response json param:
    loc: current location Id
    suggest: (string) keep walking/turn/get into the room (room info)
*/


var http = require("http");
var queryParser = require('querystring');
var url = require('url');
var bluetooth = require('./bluetoothlc');
var route = require('./route');
var user = require('./user');
var port = 4000;
var server = http.createServer(function(req, res) {

  var param = url.parse(req.url, true).query;
  if (param.debug) {
      if (param.newloc)
          bluetooth.setLoc(parseInt(param.newloc));
      for (var a in param)
          user.setUsrLoc(a, param[a]);
      res.end("Data set succesfully");
      return;
  }
  //console.log(param);
  //console.log(user.collection)
  var id = param.id;
  var rssis = {};
  try {
     rssis = JSON.parse(param.RSSIs);
   }
  catch(err) {
      //console.error(err);
  }
  //var rssis = [];
  var prevloc = parseInt(param.loc);
  if (user.checkId(id) && bluetooth.checkRSSI(rssis) && route.checkloc(prevloc)) {
      //console.log('sanity check passed')
    }
  else {
      console.log('sanity check failed')
      res.writeHead(404);
      res.end();
      return;
  }
  var curloc = user.updateUser(id, rssis);
  var result ={};
  result.loc = curloc;
  //console.log('user ' + id + ' location updated to ' + curloc);
  if (param.isNavi == 'true') {
      console.log('Initate Navigation...')
      var sg = "";
      if (checkAuth()) {        
          if (user.checkId(param.tId)) {
            var tloc = user.getUserLoc(param.tId);
            if (tloc) {          
                sg = getSuggest(curloc, prevloc, tloc);
            }
            else {
                console.error('Target Location not found');
            }
          }
          else {
              console.error('Invalide target');
          }

          result.suggest = sg;
      }
      else {
          console.log('Auth Failed');
      }
  }

  res.writeHead(200);
  res.end(JSON.stringify(result));
  
});

server.listen(port);  
console.log("Server is listening on " + port);

//certificate check
function checkAuth() {
return true;
}


function getSuggest(cur, prev, target) {
  
  var sg = "";

  if (cur == prev) {
      sg = "keep going";
      return sg;
  }
  if (cur == target) {
      sg = "you are there";
      return sg;
  } 
  var neighbor = route.BFS(cur,target);   //route.BFS
  if (neighbor == target) {   //navigation finished
      sg += "Target found: "    
  }
  if (route.isRoom(neighbor))    //room
      sg += route.getRoomInfo(neighbor);
  else 
      sg += route.getTurn(cur, prev, neighbor);
  
  return sg;
}










