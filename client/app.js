// MODIFY THIS TO THE APPROPRIATE URL IF IT IS NOT BEING RUN LOCALLY
var socket = io.connect("http://localhost");

var canvas = document.getElementById("canvas-video");
var context = canvas.getContext("2d");
var img = new Image();

// show loading notice
context.fillStyle = "#333";
context.fillText("Loading...", canvas.width / 2 - 30, canvas.height / 3);

socket.on("frame", function(data) {
	// Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
	var uint8Arr = new Uint8Array(data.buffer);
	var str = String.fromCharCode.apply(null, uint8Arr);
	var base64String = btoa(str);

	img.onload = function() {
		context.drawImage(this, 0, 0, canvas.width, canvas.height);
	};
	img.src = "data:image/png;base64," + base64String;
});

function play(voiceName) {
	console.log("play:", voiceName);
	var cetirizine = document.getElementById("cet-audio");
	var tylenol = document.getElementById("tyl-audio");
	var twoDrugs = document.getElementById("2drugs-audio");

	if (voiceName === "twodrugs") twoDrugs.play();
	else if (voiceName === "cetirizine") cetirizine.play();
	else if (voiceName === "paracetamol") tylenol.play();
}

var throttleDelay = 15000;
var throttleFn = _.throttle(function(voiceName) {
	play(voiceName);
}, throttleDelay);

socket.on("cetirizine", function(data) {
	throttleFn("cetirizine");
});

socket.on("paracetamol", function(data) {
	throttleFn("paracetamol");
});

socket.on("twodrugs", function(data) {
	throttleFn("twodrugs");
});
