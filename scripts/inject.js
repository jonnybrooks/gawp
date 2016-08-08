var head = document.querySelector('head');
var ref = document.querySelector('script[src="http://localhost:3000/gawp"]');
var project = ref.getAttribute('data-project');
var script = document.createElement('script');
script.setAttribute('src', 'https://rawgit.com/socketio/socket.io-client/master/socket.io.js');
script.onload = function(){
	script = document.createElement('script');
	script.innerHTML = `
		var socketio = io('http://localhost:3000');
		socketio = socketio.connect();		
		socketio.on('connect', function(){
			socketio.emit('link_project', {project: "${project}"});
			console.log('Watch script initialised. Changes to the filesystem will reload the page automatically :)');
		});			
		socketio.on('reconnect', reload);	
		socketio.on('reload', reload);
		
	  	function reload(data){
	  		socketio.emit('end', {id: socketio.id});
			location.reload();
	  	}	
	`;
	head.insertBefore(script, ref); 
}
head.insertBefore(script, ref);