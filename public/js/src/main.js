let cache = {};

$.getJSON( "http://localhost:3000/gawpers", gawpers => {
	cache = JSON.parse(JSON.stringify(gawpers)) || {};
	$('.active-gawpers span').text(Object.keys(gawpers).length);
	$('.manager .widget.save').click(function(){
		delete gawpers["default"];
		$.post( "http://localhost:3000/update", gawpers, function(data, status) {
			location.reload();
		});
	});
	$('.manager .widget.revert').click(function(){
		$('.gawper').removeClass('disabled');
		gawpers = cache;
	});
	$('.manager .widget.add').click(function(){
		gawpers['New Gawper'] = '';
		buildgawper('New Gawper', '');
	});
	$.each(gawpers, buildgawper);

	function buildgawper (name, path){
    	let frag = utils.fragment($('#template--gawper').html());
		let index = name;
		$(frag).find('.gawper .name').val(name);
		$(frag).find('.gawper .path').val(path);
		$(frag).find('.input-name input').on('input', function(){
			$(this).parents('.gawper').removeClass('force-deletion');
			delete gawpers[index];
			index = $(this).val();
			gawpers[index] = path;
			if($(this).val() === "") {
				$(this).parents('.gawper').addClass('force-deletion');
				delete gawpers[index]; 
			}			
		});
		$(frag).find('.input-path input').on('input', function(){
			path = $(this).val();
			gawpers[index] = path;
		});
		$(frag).find('.gawper .delete-gawper').click(function(){
			$(this).parent().addClass('disabled');
			delete gawpers[name];
		});		
		$('.gawpers-wrapper').append(frag);
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