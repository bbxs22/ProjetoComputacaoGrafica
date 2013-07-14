var Filters = Filters || {};
Filters.nothing = new Filter('Nothing', [[0, 0, 0], [0, 1, 0], [0, 0, 0]], BorderEffect.null);
Filters.erase = new Filter('Eraser', [[0, 0, 0], [0, 0, 0], [0, 0, 0]], BorderEffect.reflection);
Filters.box = new Filter('Box', [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]], BorderEffect.periodic);
Filters.gauss2 = new Filter('Gauss2', [[1/16, 2/16, 1/16], [2/16, 4/16, 2/16], [1/16, 2/16, 1/16]], BorderEffect.null);
Filters.gauss3 = new Filter('Gauss3', [[1/64, 3/64, 3/64, 1/64], [3/64, 9/64, 9/64, 3/64], [3/64, 9/64, 9/64, 3/64], [1/64, 3/64, 3/64, 1/64]], BorderEffect.null);
Filters.gauss4 = new Filter('Gauss4', [[1/256, 4/256, 6/256, 4/256, 1/256], [4/256, 16/256, 24/256, 16/256, 4/256], [6/256, 24/256, 36/256, 24/256, 6/256], [4/256, 16/256, 24/256, 16/256, 4/256], [1/256, 4/256, 6/256, 4/256, 1/256]], BorderEffect.null);

//BorderEffect.nothing
//BorderEffect.null
//BorderEffect.reflection
//BorderEffect.periodic

var defaultCanvas = new Canvas('default-image', 128, 128);
var resultCanvas = new Canvas('result-image', 128, 128);

function prepareMatrix() {
    var filter = Filters[$('#filters').val()];
    
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if (i < filter.rows && j < filter.columns) {
                $('#filter-matrix-' + i + '-' + j).text(filter.values[i][j]);
            }
            else {
                $('#filter-matrix-' + i + '-' + j).text('');
            }
        }
    }
};

$(document).ready(function(){
    defaultCanvas.prepare('images/lenna128.png');
    resultCanvas.prepare();
    
    for (key in Filters) {
        $('#filters').append('<option value="' + key + '">' + Filters[key].name + '</option>');
    }
    
    prepareMatrix();
    $('#filter').hide();
    
    $('#options').click(function(){
        $('#filter').slideToggle();
    });
    
    $('#filters').change(function(){
        prepareMatrix();
    });
    
    $('#apply').click(function(){
        $('#filter').slideUp(function(){
            var filter = Filters[$('#filters').val()];
            defaultCanvas.applyFilter(resultCanvas, filter);
            $(this).show(function(){
                $('#applied-filter').text(Filters[$('#filters').val()].name);
            });
        });
    });
    
    $('#close').click(function(){
        $('#filter').slideUp();
    });
});
