var fs = require('fs');

//returns ppn structure
//{
//	magic: String,
//	width: Number,
//	height: Number,
//	max_color: Number,
//	pixels: [ {r:Number, g: Number, b: Number} ]
//}
function loadPPN(filename) {
	fs.readFile(filename, {encoding:"utf8"}, function(err, data) {
		var ppn = {};
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
		//ppn.pixels = pixels;
		console.log(ppn,pixels[0]);
	});
}

var source_file = process.argv[2];
var dest_file = process.argv[3] || source_file + ".png";

loadPPN(source_file);