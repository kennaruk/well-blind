var cv = require("opencv");
var throttle = require("lodash.throttle");

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

// face detection properties
// 255 102 0
// var rectColor = [0, 255, 0];
var rectColor = [0, 102, 255];
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function(socket) {
	setInterval(function() {
		camera.read(function(err, im) {
			if (err) throw err;
			im.detectObject(
				// "./node_modules/opencv/data/haarcascade_frontalface_alt2.xml",
				// "./cetirizine.xml",
				// "tylenol-test-1.xml",
				// "certrizine333.xml" **detected** ,
				"./cetrizine333.xml",
				{},
				function(err, faces) {
					if (err) throw err;
					for (var i = 0; i < faces.length; i++) {
						face = faces[i];
						im.rectangle(
							[face.x, face.y],
							[face.width, face.height],
							rectColor,
							rectThickness
						);
					}
					socket.emit("frame", { buffer: im.toBuffer() });
					socket.emit("cetirizine", {});
					socket.emit("paracetamol", {});
					console.log("length ", faces.length);
				}
			);
		});
	}, camInterval);
};
