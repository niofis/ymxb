var fs = require('fs');
var pngjs = require('pngjs');
//returns ppn structure
//{
//	magic: String,
//	width: Number,
//	height: Number,
//	max_color: Number,
//	pixels: [ {r:Number, g: Number, b: Number} ]
//}
function loadPPN(filename) {
	var data = fs.readFileSync(filename, {encoding:"utf8"});
	var img = {};
	var matches = /(P6)\s([0-9]+)\s([0-9]+)\s([0-9]+)\s(.*)/ig.exec(data);

	ppn.magic = matches[1];
	ppn.width = parseInt(matches[2]);
	ppn.height = parseInt(matches[3]);
	ppn.max_color = parseInt(matches[4]);
		
	var pixels = [];
	matches[5].match(/(...)/ig)
		.forEach(function (pixel) {
			var p = {
				r: pixel.charCodeAt(0),
				g: pixel.charCodeAt(1),
				b: pixel.charCodeAt(2)
			}

			pixels.push(p);
		});
	ppn.pixels = pixels;
	//console.log(ppn,pixels[0]);
	return ppn;
}

function loadJI (source_file) {
	var data = fs.readFileSync(source_file, {encoding:'utf8'});
	var img = JSON.parse(data);
	var pixels = [];

	img.pixels.match(/[0-9a-f]{6}/ig)
	.forEach(function (pixel) {
		var p = {
			r: parseInt(pixel.substr(0,2),16),
			g: parseInt(pixel.substr(2,2),16),
			b: parseInt(pixel.substr(4,2),16)
		}
		pixels.push(p);
	});

	img.pixels = pixels;
	return img;
}

function savePNG (img, dest_file) {
	var png = new pngjs.PNG({width:img.width,height:img.height});


	for(var y=0;y<height;++y){
		for(var x=0;x<width;++x){
			var p = 4*(y*width + x);
			var c = buffer[(y*width + x)].to255();

			png.data[p] = c[0];
			png.data[p+1] = c[1];
			png.data[p+2] = c[2];
			png.data[p+3] = c[3];
		}
	}

	png.pack().pipe(fs.createWriteStream(dest_file));
}

var format = process.argv[2];
var source_file = process.argv[3];
var dest_file = process.argv[4] || source_file + ".png";

if (format === "-ppn") {

}
var img = loadPPN(source_file);
savePNG(img,dest_file);