var _ = require('underscore.deferred');
var spawn = require('child_process').spawn;

function hrdiff(t1, t2) {
    var s = t2[0] - t1[0];
    var mms = t2[1] - t1[1];
    return s+(mms/1e9);
}

function promise(test) {
	return function () {
		var dfd = new _.Deferred();
		var op = test.cmd.shift();
		var params = test.cmd;
		var data = '';
		var hr_start = process.hrtime();
		var proc = spawn(op,params);
		proc.stdout.setEncoding('utf8');
		proc.stdout.on('data', function (chunk) {
			data+=chunk;
		});
		proc.on('close', function (code) {
			var hr_end = process.hrtime();
			console.log(test.title + ". Done in " + hrdiff(hr_start,hr_end) + "s");

			console.log('Saving image: ' + test.out_image);
			var img2png = spawn('node', ['img2png.js', '-stdin', test.out_image]);
			img2png.stdin.write(data);
			img2png.stdin.end();

			dfd.resolve();

		});
		
		return dfd.promise();
	}
}

var test1 = promise(
	{
		title:'light.js - simple',
		cmd: ['node', 'light.js'],
		out_image: 'light.js.png'
	}
);
var test2 = promise(
	{
		title:'light.js - simple 2',
		cmd: ['node', 'light.js'],
		out_image: 'light2.js.png'
	}
);

test1()
.then(test2)
.done(function () {
	console.log("All tests done!");
});

