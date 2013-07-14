var Filters = Filters || {};
Filters.nothing = new Filter('Nothing', [[0, 0, 0], [0, 9, 0], [0, 0, 0]], BorderEffect.null);
Filters.erase = new Filter('Eraser', [[0, 0, 0], [0, 0, 0], [0, 0, 0]], BorderEffect.reflection);
Filters.box = new Filter('Box', [[1, 1, 1], [1, 1, 1], [1, 1, 1]], BorderEffect.periodic);

//BorderEffect.nothing
//BorderEffect.null
//BorderEffect.reflection
//BorderEffect.periodic

var defaultCanvas = new Canvas('default-image', 512, 512);
var resultCanvas = new Canvas('result-image', 512, 512);

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
    defaultCanvas.prepare('images/lenna.png');
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
