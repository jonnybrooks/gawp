var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var watch = require('watch');
var fs = require('fs');
var path = require('path');

var users = {};
var projects = JSON.parse(fs.readFileSync('gawp.json')).projects;
    projects = Object.keys(projects).length === 0 ? { default: path.join(__dirname, 'public') } : projects;

app.set('port', (3000));

app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/projects', function (req, res){
  res.set('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify(projects));
});

app.get('/gawp', function (req, res){
  fs.readFile('scripts/inject.js', function (err, data){
    if (err) throw err;
    res.set('Content-Type', 'text/javascript');
    res.status(200).end(data);
  });
});

app.get('/', function (req, res){
  res.status(200).sendFile(path.join(__dirname, 'public/monitor.html'));
});

http.listen(app.get('port'), function () {
  console.log('Server running on localhost:'+ app.get('port'));
});

io.sockets.on('connection', function (socket){
  users[socket.conn.id] = socket;
  socket.on('link_project', function (data){
    if(typeof data.project === "undefined" || typeof projects[data.project] === "undefined") return;
    watch.watchTree(projects[data.project], function (f, curr, prev) {
      if(typeof f == "object" && prev === null && curr === null) return;
      if(typeof users[socket.conn.id] === "undefined") return;
      users[socket.conn.id].emit('reload');
    });    
  });
  socket.on('end', function (data){
    if(typeof data.project === "undefined" || typeof projects[data.project] === "undefined") return;
    watch.unwatchTree(projects[data.project]);
    if(typeof users[socket.conn.id] === "undefined") return;
    delete users[socket.conn.id];
  });
});