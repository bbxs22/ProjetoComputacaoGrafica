var Canvas = Canvas || {};

/**
	Converte uma posição de matriz (linha, coluna) para uma de vetor.
	@param image imagem
	@param i linha
	@param j coluna
	@return indice do pixel (i, j) na imagem
*/
Canvas.getPixelIndex = function(image, i, j) {
    return (i + j * image.width) * 4;
};

/**
	Cria um objeto pixel contendo a informação do indice e dos canais RGBA de um pixel (i, j) na imagem.
	@param image umagem
	@param i linha do pixel
	@param j coluna do pixel
	@return objeto com as informações do pixel: index (indice), red (canal vermelho de 0 a 255), green (canal verde de 0 a 255), blue (canal azul de 0 a 255), alpha (canal opacidade 0 a 255)
*/
Canvas.getPixel = function(image, i, j) {
    var index = Canvas.getPixelIndex(image, i, j);
    var red = image.data[index + 0];
    var green = image.data[index + 1];
    var blue = image.data[index + 2];
    var alpha = image.data[index + 3];
    
    return {'index': index, 'red': red, 'green': green, 'blue': blue, 'alpha': alpha};
}

/**
	Atualiza o pixel (i, j) da imagem com os valores dos canais
	@param image imagem
	@param i linha do pixel
	@param j coluna do pixel
	@param red canal vermelho (0 a 255)
	@param green canal verde (0 a 255)
	@param blue canal azul (0 a 255)
	@param alpha canal opacidade (0 a 255)
*/
Canvas.setPixel = function(image, i, j, red, green, blue, alpha) {
    var index = Canvas.getPixelIndex(image, i, j);
    if (red) image.data[index + 0] = red;
    if (green) image.data[index + 1] = green;
    if (blue) image.data[index + 2] = blue;
    if (alpha) image.data[index + 3] = alpha;
};

/**
	Carrega uma imagem no canvas
*/
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
