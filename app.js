var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var watch = require('watch');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var users = {};
var gawpers = {}; 

try {
  gawpers = JSON.parse(fs.readFileSync('gawp.json'));
  gawpers = gawpers.gawpers || gawpers.projects || {};  
}
catch(e) {
  console.log("gawp.json likely empty - falling back to default");  
}

gawpers = Object.keys(gawpers).length === 0 ? { default: path.join(__dirname, 'public') } : gawpers;

app.set('port', (3000));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function (req, res){
  res.status(200).sendFile(path.join(__dirname, 'public/monitor.html'));
});

app.post('/update', function (req, res){
  fs.writeFile('gawp.json', JSON.stringify({ gawpers: req.body }, null, '\t'), (err) => {
    if (err) throw err;
    console.log('Written to gawp.json from gawp web monitor');
    res.status(200).end('success');
  });  
});

app.get('/gawpers', function (req, res){
  res.set('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify(gawpers));
});

app.get('/gawp', function (req, res){
  fs.readFile('scripts/inject.js', function (err, data){
    if (err) throw err;
    res.set('Content-Type', 'text/javascript');
    res.status(200).end(data);
  });
});

http.listen(app.get('port'), function () {
  console.log('Server running on localhost:'+ app.get('port'));
});

io.sockets.on('connection', function (socket){
  users[socket.conn.id] = socket;
  socket.on('link_gawper', function (data){
    if(typeof data.gawper === "undefined" || typeof gawpers[data.gawper] === "undefined") {
      users[socket.conn.id].emit('no_gawper');
      return;
    }
    watch.watchTree(gawpers[data.gawper], function (f, curr, prev) {
      if(typeof f == "object" && prev === null && curr === null) return;
      if(typeof users[socket.conn.id] === "undefined") return;
      users[socket.conn.id].emit('reload');
    });    
  });
  socket.on('end', function (data){
    if(typeof data.gawper === "undefined" || typeof gawpers[data.gawper] === "undefined") return;
    watch.unwatchTree(gawpers[data.gawper]);
    if(typeof users[socket.conn.id] === "undefined") return;
    delete users[socket.conn.id];
  });
});