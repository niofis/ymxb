var spawn = require('child_process').spawn;
/*
function hrdiff(t1, t2) {
    var s = t2[0] - t1[0];
    var mms = t2[1] - t1[1];
    return s+mms;//*1e9 + mms;
}

var hr_start = process.hrtime();
var proc = spawn('node', ['light.js']);
proc.on('close', function(code) {
	var hr_end = process.hrtime();
	console.log('light.js closed with code: ' + code);
	console.log('time: ' + hrdiff(hr_start,hr_end) + " s");
})*/
var fs = require('fs');
fs.readFile('/proc/cpuinfo', function (err,data) {
	console.log(err);
	console.log(data);
})