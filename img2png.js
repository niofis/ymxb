var fs = require('fs');
var pngjs = require('pngjs');
//returns ppm structure
//{
//	magic: String,
//	width: Number,
//	height: Number,
//	max_color: Number,
//	pixels: [ {r:Number, g: Number, b: Number} ]
//}
function loadPPM(filename) {
	var data = fs.readFileSync(filename, {encoding:"utf8"});
	var img = {};
	var matches = /(P6)\s([0-9]+)\s([0-9]+)\s([0-9]+)\s(.*)/ig.exec(data);
	var ppm = {};
	ppm.magic = matches[1];
	ppm.width = parseInt(matches[2]);
	ppm.height = parseInt(matches[3]);
	ppm.max_color = parseInt(matches[4]);
		
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
	ppm.pixels = pixels;
	//console.log(ppm,pixels[0]);
	return ppm;
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

function loadSTDIN (callback) {
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	var data = '';
	process.stdin.on('data', function (chunk) {
		data += chunk;
	});
	process.stdin.on('end', function () {
		//create img
		var img = {};
		var lines = data.split('\n');

		img.height = lines.length;
		img.width = lines[0].length / 6;
		
		if(lines[lines.length-1].length == 0){
			img.height--;
		}


		var pixels = [];

		data.match(/[0-9a-f]{6}/ig)
		.forEach(function (pixel) {
			var p = {
				r: parseInt(pixel.substr(0,2),16),
				g: parseInt(pixel.substr(2,2),16),
				b: parseInt(pixel.substr(4,2),16)
			}
			pixels.push(p);
		});

		img.pixels = pixels;
		callback(img);
	});
}

function savePNG (img, file) {
	var png = new pngjs.PNG({width:img.width,height:img.height});

	for(var y=0; y<img.height; ++y){
		for(var x=0; x<img.width; ++x){
			var po = (y*img.width + x);
			var p = po*4;
			var c = img.pixels[po];

			png.data[p] = c.r;
			png.data[p+1] = c.g;
			png.data[p+2] = c.b;
			png.data[p+3] = 255;
		}
	}

	png.pack().pipe(fs.createWriteStream(file));
}

var format = process.argv[2];
var source_file = process.argv[3];
var dest_file = process.argv[4] || source_file + ".png";

var img = null;
if (format === "-ppm") {
	img = loadPPM(source_file);
} else if (format == "-ji") {
	img = loadJI(source_file);
} else if (format == "-stdin") {
	loadSTDIN(function (img) {
		savePNG(img, source_file);
	});
}

if (img) {
	savePNG(img,dest_file);	
}