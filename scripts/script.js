var Canvas = Canvas || {};

Canvas.getPixelIndex = function(image, i, j) {
	return (i + j * image.width) * 4;
};

Canvas.getPixel = function(image, i, j) {
	var index = Canvas.getPixelIndex(image, i, j);
    var red = image.data[index + 0];
    var green = image.data[index + 1];
    var blue = image.data[index + 2];
    var alpha = image.data[index + 3];
	
	return {'index': index, 'red': red, 'green': green, 'blue': blue, 'alpha': alpha};
}

Canvas.setPixel = function(image, i, j, red, green, blue, alpha) {
	var index = Canvas.getPixelIndex(image, i, j);
    if (red) image.data[index + 0] = red;
    if (green) image.data[index + 1] = green;
    if (blue) image.data[index + 2] = blue;
	if (alpha) image.data[index + 3] = alpha;
};

Canvas.loadImage = function() {	
	var image = new Image();
	image.src = 'images/lenna.png';
    image.onload = function() {
		var canvas = document.getElementById('default-image');
		Canvas.context = canvas.getContext("2d");
		Canvas.context.drawImage(image, 0, 0);
		Canvas.image = Canvas.context.getImageData(0, 0, image.width, image.height);
	};
};

$(document).ready(function(){
	Canvas.loadImage();
});
