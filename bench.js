var spawn = require('child_process').spawn;

function hrdiff(t1, t2) {
    var s = t2[0] - t1[0];
    var mms = t2[1] - t1[1];
    return s+(mms/1e9);
}

var hr_start = process.hrtime();
var proc = spawn('node', ['light.js']);
proc.on('close', function(code) {
	var hr_end = process.hrtime();
	console.log('time: ' + hrdiff(hr_start,hr_end) + " s");
})