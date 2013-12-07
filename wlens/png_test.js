var fs = require('fs');
var pngjs = require('pngjs');
var width=640;
var height = 480;
var png = new pngjs.PNG({width:width,height:height});


for(var y=0;y<height;++y){
	for(var x=0;x<width;++x){
		var p = 4*(y*width + x);
		png.data[p] = 0;
		png.data[p+1] = 0;
		png.data[p+2] = 255;
		png.data[p+3] = 255;
	}
}


png.pack().pipe(fs.createWriteStream('out.png'));