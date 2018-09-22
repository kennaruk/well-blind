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
		this.isScanPara = false;
		this.isScanCeti = false;

		this.foundPara = false;
		this.foundCeti = false;

		var emitBack = im => {
			socket.emit("frame", { buffer: im.toBuffer() });
			if (this.isScanPara && this.isScanCeti) {
				if (this.foundPara && this.foundCeti) socket.emit("twodrugs", {});
				else if (this.foundPara) socket.emit("paracetamol", {});
				else if (this.foundCeti) socket.emit("cetirizine", {});
			}
		};

		camera.read((err, im) => {
			if (err) throw err;
			im.detectObject(
				"./node_modules/opencv/data/haarcascade_frontalface_alt2.xml",
				{},
				(err, paras) => {
					this.isScanPara = true;
					if (err) throw err;
					for (var i = 0; i < paras.length; i++) {
						para = paras[i];
						im.rectangle(
							[para.x, para.y],
							[para.width, para.height],
							rectColor,
							rectThickness
						);
					}
					if (paras.length > 0) this.foundPara = true;
					emitBack(im);
				}
			);
			//

			im.detectObject(
				"./node_modules/opencv/data/haarcascade_frontalface_alt2.xml",
				{},
				(err, cetirizines) => {
					this.isScanCeti = true;
					if (err) throw err;
					for (var i = 0; i < cetirizines.length; i++) {
						cetirizine = cetirizines[i];
						im.rectangle(
							[cetirizine.x, cetirizine.y],
							[cetirizine.width, cetirizine.height],
							[0, 102, 255],
							rectThickness
						);
					}
					if (cetirizines.length > 0) this.foundCeti = true;
					emitBack(im);
				}
			);
			//
		});
	}, camInterval);
};
