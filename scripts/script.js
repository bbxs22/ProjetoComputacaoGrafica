var Main = Main || {};

Main.loadImage = function() {
	$("canvas").drawImage({
		source: 'images/lenna.png',
		x: 256,
		y: 256
	});
}

$(document).ready(function(){
	Main.loadImage();
});
