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
			this.y * s,
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
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
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

	c.prototype.mul = function (s) {
		var r = new lens.Color(
			this.r * s,
			this.g * s,
			this.b * s,
			this.a);

		return r;
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

lens.PointLight = (function () {
	var li = function (center) {
		this.center = center || new lens.Vector3();
	}

	return li;
})();

lens.Sphere = (function () {
	var sp = function (center, radius, color) {
		this.center = center || new lens.Vector3();
		this.radius = radius || 0;
		this.color = color || new lens.Color();
	};

	sp.prototype.normal = function (point) {
		var n = point.sub(this.center).normal();
		return n;
	}

	sp.prototype.hit = function (ray) {
		var result = {
			hit: false,
			distance: 0,
			obj: this
		}

		var L = this.center.sub(ray.origin);
		var tca = L.dot(ray.direction);

		if (tca < 0) {
			return result;
		}

		var d2 = L.dot(L) - tca * tca;

		if (d2 > this.radius) {
			return result;
		}

		var thc = Math.sqrt(this.radius - d2);

		var t0 = tca - thc;
		var t1 = tca + thc;

		if(t1 < t0){
			t0 = t1;
		}

		if(t0 < 0.1){
			return result;
		}

		result.hit = true;
		result.distance = t0;
		return result;
	}
	return sp;
})();

lens.Triangle = (function () {
	var tr = function (v0, v1, v2, color) {
		this.v0 = v0 || new lens.Vector3();
		this.v1 = v1 || new lens.Vector3();
		this.v2 = v2 || new lens.Vector3();
		this.color = color || new lens.Color();

		this.n = v1.sub(v0)
		.cross(v2.sub(v0)).normal();
	}

	tr.prototype.normal = function () {
		return this.n;
	}

	tr.prototype.hit = function (ray) {
		var result = {
			hit: false,
			distance: 0,
			obj: this
		}

		var edge1 = this.v1.sub(this.v0);
		var edge2 = this.v2.sub(this.v0);
		var pvec = ray.direction.cross(edge2);
		var det = edge1.dot(pvec);

		if (det === 0) {
			return result;
		}

		var inv_det = 1 / det;
		var tvec = ray.origin.sub(this.v0);
		var u = pvec.dot(tvec) * inv_det;

		if (u < 0 || u > 1) {
			return result;
		}

		var qvec = tvec.cross(edge1);
		var v = ray.direction.dot(qvec) * inv_det;

		if (v < 0 || u + v > 1) {
			return result;
		}

		var t = edge2.dot(qvec) * inv_det;

		if (t < 0.1) {
			return result;
		}

		result.hit = true;
		result.distance = t;
		return result;
	}

	return tr;

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
	var scn = function (camera, objects, lights) {
		this.camera= camera || new lens.Camera();
		this.objects = objects || [];
		this.lights = lights || [];
	}

	scn.prototype.addObj = function (obj){
		this.objects.push(obj);
	}

	scn.prototype.addLight = function (li) {
		this.lights.push(li);
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

	rndr.prototype.getRay = function (x,y){
		//var point = (this.job.scene.camera.lt + (this.hdv*x) + (this.vdv*y));
		var screen_point = 
			this.job.scene.camera.left_top
			.add(this.hdv.mul(x))
			.add(this.vdv.mul(y));

		var direction = screen_point
			.sub(this.job.scene.camera.eye)
			.normal();

		var ray = new lens.Ray(this.job.scene.camera.eye,direction);
		return ray;
	}

	rndr.prototype.refractedRay = function (ray, result) {
		var n = result.ref_idx / 1.5;
		var t = result.normal.dot(ray.direction);
		var ta = n * n * (1 - t * t);
		var ref_ray = null;

		if (ta <= 1) {
			result.ref_idx = 1.5;
			var direction = ray.direction.mul(n)
				.sub(result.normal.mul(n + Math.sqrt(1 - ta)));
			ref_ray = new lens.Ray(result.hit_point, direction);
		}
		return ref_ray;
	}

	rndr.prototype.traceFirstHit = function (ray) {
		var objs = this.job.scene.objects;
		var objs_qty = objs.length;

		for(var i = 0; i < objs_qty; ++i) {
			var o = objs[i];
			if(o.hit(ray).hit === true) {
				return true;
			}
		}
		
		return false;
	}

	rndr.prototype.trace = function (ray){
		var that = this;

		var result = {
			distance: Number.MAX_VALUE,
			hit: false
		};

		this.job.scene.objects.forEach(function (obj) {
			var trc = obj.hit(ray);
			
			if (trc.hit === true && trc.distance < result.distance) {
				result = trc;

				result.ref_idx = 1.00293;

				result.hit_point = ray.origin.add(
					ray.direction.mul(
						result.distance));
				result.normal = result.obj.normal(
					result.hit_point);

				if (result.obj.color.a < 1) {
					var ref_ray = that.refractedRay(ray, result);
					if (ref_ray) {
						result = that.trace(ref_ray);
					}
				}
			}
		});

		return result;
	}

	rndr.prototype.shade = function (ray, result) {
		var that = this;

		result.color = new lens.Color(0,0,0,1);

		this.job.scene.lights.forEach(function (li) {
			var direction = li.center.sub(result.hit_point).normal();
			var shadow_ray = new lens.Ray(result.hit_point,direction);

			if(that.traceFirstHit(shadow_ray) === false) {
				var tc = result.normal.dot(direction.normal());
				if(tc > 0) {
					result.color = result.obj.color.mul(tc);
				}
			}
		});
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
				var ray = this.getRay(x + s.left,y + s.top);
				var result = this.trace(ray);
				if(result.hit){
					this.shade(ray,result)
					buffer[y*s.width + x] = result.color;
				}
				else
					buffer[y*s.width + x] = new lens.Color(0.2,0.2,0.2,1.0);
			}
		}
	}

	return rndr;
})();

function cornellBox (scene) {
	var w = 4;
	var h = 8;
	var l = 8;
	var back1 = new lens.Triangle(
		new lens.Vector3(-w,0,l),
		new lens.Vector3(-w,h,l),
		new lens.Vector3(w,0,l),
		new lens.Color(1,1,1,1)
		);

	var back2 = new lens.Triangle(
		new lens.Vector3(-w,h,l),
		new lens.Vector3(w,h,l),
		new lens.Vector3(w,0,l),
		new lens.Color(1,1,1,1)
		);

	var bottom1 = new lens.Triangle(
		new lens.Vector3(-w,0,l),
		new lens.Vector3(w,0,l),
		new lens.Vector3(w,0,-l),
		new lens.Color(1,1,1,1)
		);

	var bottom2 = new lens.Triangle(
		new lens.Vector3(-w,0,l),
		new lens.Vector3(w,0,-l),
		new lens.Vector3(-w,0,-l),
		new lens.Color(1,1,1,1)
		);


	scene.addObj(back1);
	scene.addObj(back2);
	scene.addObj(bottom1);
	scene.addObj(bottom2);
}

lens.SceneDemo1 = function () {
	var scn = new lens.Scene();

	cornellBox(scn);
	//Blue sphere

	/*
	var sp = new lens.Sphere(
		new lens.Vector3(0,0,0),
		1.0,
		new lens.Color(0,0,1,1));
	scn.addObj(sp);

	scn.addObj(
		new lens.Sphere(
			new lens.Vector3(2,0,-1),
			0.5,
			new lens.Color(1,0,0,1))
	);

	scn.addObj(
		new lens.Sphere(
			new lens.Vector3(-3,0,-1),
			0.5,
			new lens.Color(0,1,0,1))
	);
	scn.addObj(
		new lens.Sphere(
			new lens.Vector3(2,2,-2),
			0.5,
			new lens.Color(1,1,1,0))
		);
*/
	scn.addLight(
		new lens.PointLight(
			new lens.Vector3(50,50,-50)
			)
		);

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