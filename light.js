//For ASCII banners:
//http://www.network-science.de/ascii/
//font: banner3

var lens ={}

lens.Vector3 = (function () {
	var v=function (x,y,z){
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	v.prototype.length = function () {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	}

	v.prototype.normal = function () {
		var len = this.length();
		return new lens.Vector3(
			this.x / len,
			this.y / len,
			this.z / len);
	}

	v.prototype.add = function (v) {
		return new lens.Vector3(
			this.x + v.x,
			this.y + v.y,
			this.z + v.z);
	}

	v.prototype.sub = function (v) {
		return new lens.Vector3(
			this.x - v.x,
			this.y - v.y,
			this.z - v.z);
	}

	v.prototype.cross = function (v) {
		var tx = this.y*v.z - this.z*v.y;
		var ty = this.z*v.x - this.x*v.z;
		var tz = this.x*v.y - this.y*v.x;
		return new lens.Vector3(tx,ty,tz);
	}

	v.prototype.dot = function (v) {
		return this.x*v.x + this.y*v.y + this.z*v.z;
	}

	v.prototype.mul = function (s) {
		return new lens.Vector3(
			this.x * s,
			this.y * y,
			this.z * s);
	}

	v.prototype.div = function (s) {
		return new lens.Vector3(
			this.x / s,
			this.y / s,
			this.z / s);
	}

	return v;
})();

lens.Color = (function (){
	var c = function (r,g,b,a) {
		this.r = r || 0;
		this.g = g || 0;
		this.b = b || 0;
		this.a = a || 1.0;
	}

	c.prototype.to255 = function () {
		var c255=[		
			Math.min(this.r*255,255),
			Math.min(this.g*255,255),
			Math.min(this.b*255,255),
			Math.min(this.a*255,255)
		];
		return c255;
	}

	return c;
})();

lens.Ray = (function () {
	var ray = function (origin, direction) {
		this.origin = origin;
		this.direction = direction;
	};

	return ray;
})();

lens.Sphere = (function () {
	var sp = function (center, radius, color) {
		this.center = center || new lens.Vector3();
		this.radius = radius || 0;
		this.color = color || new lens.Color();
	};
	return sp;
})();

lens.Camera = (function () {
	var cam = function (left_bottom, left_top, right_top, eye) {
		this.left_bottom = left_bottom || new lens.Vector3();
		this.left_top = left_top || new lens.Vector3();
		this.right_top = right_top || new lens.Vector3();
		this.eye = eye || new lens.Vector3();
	}

	return cam;
})();

lens.Scene = (function (){
	var scn = function (camera, objects) {
		this.camera= camera || new lens.Camera();
		this.objects = objects || [];
	}

	scn.prototype.addObj = function (obj){
		this.objects.push(obj);
	}

	return scn;
})();

lens.Section = (function () {
	var sct = function (left,top,width,height){
		this.left = left || 0;
		this.top = top || 0;
		this.width = width || 0;
		this.height = height ||0;
	}

	return sct;
})();

lens.Resolution = (function (){
	var rs = function(width,height){
		this.width = width || 640;
		this.height = height || 480;
	}

	return rs;
})();

lens.Job = (function (){
	var j = function (scene,section,resolution) {
		this.scene = scene || new lens.Scene();
		this.section= section || new lens.Section();
		this.resolution = resolution || new lens.Resolution();
	}

	return j;
})();

lens.Renderer = (function () {
	var rndr = function () {
		this.job = new lens.Job();
	}

	function getRay(x,y){
		//var point = (this.job.scene.camera.lt + (this.hdv*x) + (this.vdv*y));
		var screen_point = 
			this.job.scene.camera.lt
			.add(this.hdv.mul(x))
			.add(this.vdv.mul(y));

		var direction = screen_point
			.sub(this.job.scene.camera.eye)
			.normal();

		var ray = new lens.Ray(screen_point,direction);
		return ray;
	}

	rndr.prototype.render = function (job,buffer) {
		var j = this.job = job;
		var s = j.section;

		this.hdv = j.scene.camera.right_top
			.sub(j.scene.camera.left_top)
			.div(j.resolution.width);

		this.vdv = j.scene.camera.left_bottom
			.sub(j.scene.camera.left_top)
			.div(j.resolution.height );

		for(var y = 0; y < s.height; ++y){
			for(var x = 0; x < s.width; ++x){
				var ray = getRay(x + s.left,y + s.top);
				buffer[y*s.width + x] = new lens.Color(1.0,0,0,1.0);
			}
		}
	}

	return rndr;
})();

lens.SceneDemo1 = function () {
	var scn = new lens.Scene();
	//Blue sphere
	var sp = new lens.Sphere(
		new lens.Vector3(0,0,0),
		1.0,
		new lens.Color(0,0,1.0,1.0));
	scn.addObj(sp);

	//4:3 camera
	var cam = new lens.Camera(
		new lens.Vector3(-3.2,0,-5),
		new lens.Vector3(-3.2,4.8,-5),
		new lens.Vector3(3.2,4.8,-5),
		new lens.Vector3(0,2.4,-15));
	scn.camera=cam;

	return scn;
};

lens.render = function(done){
	var buffer = [];

	var scene = lens.SceneDemo1();
	var section = new lens.Section(0,0,640,480);
	var resolution = new lens.Resolution(640,480);
	var job = new lens.Job(scene,section,resolution);

	var renderer = new lens.Renderer();
	renderer.render(job,buffer);

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

	lens.render(function(buffer){
		var png = new pngjs.PNG({width:width,height:height});


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


		png.pack().pipe(fs.createWriteStream('out.png'));
	});
	
}