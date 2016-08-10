var head = document.querySelector('head');
var ref = document.querySelector('script[src="http://localhost:3000/gawp"]');
var gawper = ref.getAttribute('data-gawper') || ref.getAttribute('data-project');

var script = document.createElement('script');
script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.8/socket.io.min.js');
script.onload = function(){
	script = document.createElement('script');
	script.innerHTML = `
		var socketio = io('http://localhost:3000');
		socketio = socketio.connect();		
		socketio.on('connect', function(){
			socketio.emit('link_gawper', {gawper: "${gawper}"});
			console.log('Watch script initialised. Changes to the filesystem will reload the page automatically :)');
		});	
		socketio.on('no_gawper', function(){
			socketio.disconnect();
			console.log('No matching gawper found. Disconnecting from the gawp server.');
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