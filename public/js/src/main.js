let cache = {};

$.getJSON( "http://localhost:3000/projects", projects => {
	cache = JSON.parse(JSON.stringify(projects)) || {};
	$('.active-projects span').text(Object.keys(projects).length);
	$('.manager .widget.save').click(function(){
		$.post( "http://localhost:3000/update", projects, function(data, status) {
			location.reload();
		});
	});
	$('.manager .widget.revert').click(function(){
		$('.project').removeClass('disabled');
		projects = cache;
	});
	$('.manager .widget.add').click(function(){
		projects['New Gawper'] = '';
		buildProject('New Gawper', '');
	});
	$.each(projects, buildProject);

	function buildProject (name, path){
    	let frag = utils.fragment($('#template--project').html());
		let index = name;
		$(frag).find('.project .name').val(name);
		$(frag).find('.project .path').val(path);
		$(frag).find('.input-name input').on('input', function(){
			delete projects[index];
			index = $(this).val();
			projects[index] = path;
			if($(this).val() === "") {
				alert('You must give your gawper a name, or it will be removed from the project configuration file');
				delete projects[index]; 
			}			
		});
		$(frag).find('.input-path input').on('input', function(){
			path = $(this).val();
			projects[index] = path;
		});
		$(frag).find('.project .delete-project').click(function(){
			$(this).parent().addClass('disabled');
			delete projects[name];
		});		
		$('.projects-wrapper').append(frag);
    }
});

let utils = {
	fragment: function (htmlStr) {
		let frag = document.createDocumentFragment();
		let temp = document.createElement('div');
		temp.innerHTML = htmlStr;
		while (temp.firstChild) { frag.appendChild(temp.firstChild);}
		return frag;
    }    
};