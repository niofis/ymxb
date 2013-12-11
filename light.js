//For ASCII banners:
//http://www.network-science.de/ascii/
//font: banner3

var lens ={}



lens.render = function(done){
	var buffer = [];
	done(buffer);
}

exports = lens;

/*
##    ##  #######  ########  ########           ##  ######  
###   ## ##     ## ##     ## ##                 ## ##    ## 
####  ## ##     ## ##     ## ##                 ## ##       
## ## ## ##     ## ##     ## ######             ##  ######  
##  #### ##     ## ##     ## ##           ##    ##       ## 
##   ### ##     ## ##     ## ##       ### ##    ## ##    ## 
##    ##  #######  ########  ######## ###  ######   ######  
*/
var app = {
  env: '',
  agent: ''
};

if (process) {
  app.env = 'node';
} else if (window) {
  app.env = 'browser';
  app.agent = navigator.userAgent;
}

if(app.env === 'node'){
	var fs = require('fs');
	var pngjs = require('pngjs');
	var width=640;
	var height = 480;
	var png = new pngjs.PNG({width:width,height:height});


	for(var y=0;y<height;++y){
		for(var x=0;x<width;++x){
			var p = 4*(y*width + x);
			png.data[p] = 0;
			png.data[p+1] = 255;
			png.data[p+2] = 0;
			png.data[p+3] = 255;
		}
	}


	png.pack().pipe(fs.createWriteStream('out.png'));
}