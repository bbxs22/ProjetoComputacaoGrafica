var BorderEffect = BorderEffect || {};
BorderEffect.nothing = function(canvas, i, j) {
    var pixel = canvas.pixel(i, j);
    return new Color(pixel.red(), pixel.green(), pixel.blue(), pixel.alpha());
};

BorderEffect.null = function(canvas, i, j) {
    if (i < 0 || i > canvas.image.height || j < 0 || j > canvas.image.width)
        return new Color();
    var pixel = canvas.pixel(i, j);
    return new Color(pixel.red(), pixel.green(), pixel.blue(), pixel.alpha());
};

BorderEffect.reflection = function(canvas, i, j) {
    var pixel = canvas.pixel(Math.abs(i), Math.abs(j));
    return new Color(pixel.red(), pixel.green(), pixel.blue(), pixel.alpha());
};

BorderEffect.periodic = function(canvas, i, j) {
    i = (canvas.image.height + i) % canvas.image.height;
    j = (canvas.image.width + j) % canvas.image.width;
    var pixel = canvas.pixel(i, j);
    return new Color(pixel.red(), pixel.green(), pixel.blue(), pixel.alpha());
};

/**
    Cor
    @param red valor inteiro entre 0 e 255
    @param green valor inteiro entre 0 e 255
    @param blue valor inteiro entre 0 e 255
    @param alpha valor inteiro entre 0 e 255
*/
var Color = function(red, green, blue, alpha) {
    this.red = red || 0;
    this.green = green || 0;
    this.blue = blue || 0;
    this.alpha = alpha || 255;
};

/**
    Filtro
    @param name nome do filtro
    @param values matrix de filtro
    @param borderEffect função que retorna um objeto Cor, que corresponde à cor de um pixel. É responsável por tratar os problemas na borda.
*/
var Filter = function(name, values, borderEffect) {
    this.name = name;
    this.values = values;
    
    this.rows = this.values.length;
    this.columns = this.values[0].length;
    this.size = this.rows * this.columns;
    
    // a função padrão é BorderEffect.null
    this.borderEffect = borderEffect || BorderEffect.null
    
    /**
        Aplica o filtro na imagem do canvas no pixel (row, column). O filtro é aplicado a todos os canais (com exceção do canal alpha).
        @param row linha do pixel
        @param column coluna do pixel
        @param canvas objeto Canvas sobre o qual sera aplicado o filtro
        @return objeto Cor correspontente ao pixel (row, column) após a aplicação do filtro
    */
    this.apply = function(row, column, canvas) {
        var color = new Color();
        var startImageRow = row - Math.floor(this.rows / 2);
        var startImageColumn = column - Math.floor(this.columns / 2);
        
        for (var i = 0, imageI = startImageRow; i < this.rows; i++, imageI++) {
            for (var j = 0, imageJ = startImageColumn; j < this.columns; j++, imageJ++) {
                var pixelColor = this.borderEffect(canvas, imageI, imageJ);
                color.red += pixelColor.red * this.values[i][j];
                color.green += pixelColor.green * this.values[i][j];
                color.blue += pixelColor.blue * this.values[i][j];
                color.alpha += pixelColor.alpha * this.values[i][j];
            }
        }
        
        color.red /= this.size;
        color.green /= this.size;
        color.blue /= this.size;
        //color.alpha /= this.size;
        color.alpha = 255;
        
        return color;
    }
};

/**
    Pixel
    @param image imagem para captura do pixel
    @param row linha do pixel
    @param column coluna do pixel
*/
var Pixel = function(image, row, column) {

    /**
        Getter/Setter para um canal do pixel na imagem
        @param index indice do canal. 0 é canal vermelho; 1 é canal verde; 2 é canal azul e 3 canal alpha
        @param value valor entre 0 e 255 que representa a participação do canal na formação da cor do pixel
        @return valor inteiro entre 0 e 255 que corresponde à participação do canal
    */
    channel = function(index, value) {
        if (value !== undefined)
            image.data[pos() + index] = value;
        return image.data[pos() + index];
    };

    /**
        Calcula a posição do pixel na matriz da imagem
        @return inteiro que corresponde à posição do pixel na imagem
    */
    pos = function() {
        return (row + column * image.width) * 4;
    };
    
    /**
        Getter/Setter para o canal vermelho
        @param value valor do canal
        @return valor inteiro entre 0 e 255 que corresponde à participação do canal vermelho
    */
    this.red = function(value) {
        return channel(0, value);
    }
    
    /**
        Getter/Setter para o canal verde
        @param value valor do canal
        @return valor inteiro entre 0 e 255 que corresponde à participação do canal verde
    */    
    this.green = function(value) {
        return channel(1, value);
    }
    
    /**
        Getter/Setter para o canal azul
        @param value valor do canal
        @return valor inteiro entre 0 e 255 que corresponde à participação do canal azul
    */    
    this.blue = function(value) {
        return channel(2, value);
    }
    
    /**
        Getter/Setter para o canal alpha
        @param value valor do canal
        @return valor inteiro entre 0 e 255 que corresponde à participação do canal alpha
    */    
    this.alpha = function(value) {
        return channel(3, value);
    }
};

/**
    Canvas
    @param id identificador do canvas na página
    @param width largura do canvas
    @param height altura do canvas
*/
var Canvas = function(id, width, height) {
    this.context = undefined;
    this.image = undefined;
    
    this.id = id;

    /**
        Prepara o canvas com a imagem
        @param imageSource imagem
    */
    this.prepare = function(imageSource) {
        var image = document.createElement('img');
        image.src = imageSource;
        image.width = width;
        image.height = height;
        
        image.onload = function(canvasObj) {
            canvasObj.context = document.getElementById(id).getContext("2d");
            canvasObj.context.drawImage(image, 0, 0);
            canvasObj.image = canvasObj.context.getImageData(0, 0, image.width, image.height);
        }(this);
    };
    
    /**
        Getter/Setter do pixel (i, j) da imagem
        @param i linha do pixel
        @param j coluna do pixel
        @param red valor inteiro entre 0 e 255 que representa a participação do canal vermelho na cor
        @param green valor inteiro entre 0 e 255 que representa a participação do canal verde na cor
        @param blue valor inteiro entre 0 e 255 que representa a participação do canal azul na cor
        @param alpha valor inteiro entre 0 e 255 que representa a participação do canal alpha na cor
    */
    this.pixel = function(i, j, red, green, blue, alpha) {
        var pixel = new Pixel(this.image, i, j);
        pixel.red(red);
        pixel.green(green);
        pixel.blue(blue);
        pixel.alpha(alpha);
        return pixel;
    };
    
    /**
        Atualiza a imagem no canvas
    */
    this.updateImage = function() {
        this.context.putImageData(this.image, 0, 0);
    };
    
    /**
        Aplica o filtro na imagem e atualiza o canvas-resultado
        @param resultCanvas objeto Canvas que representa o canvas-resultado
        @param filter objeto Filtro
    */
    this.applyFilter = function(resultCanvas, filter) {
        for (var j = 0; j < this.image.width; j++) {
            for (var i = 0; i < this.image.height; i++) {
                var color = filter.apply(i, j, this);
                resultCanvas.pixel(i, j, color.red, color.green, color.blue, 255);
            }
        }
        
        resultCanvas.updateImage();
    };
};
