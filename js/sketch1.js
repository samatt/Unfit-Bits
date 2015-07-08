var playing = false;
var fingers;
var button;
var table;
rows = []
timestamps =[]
max_time = 0;
min_time = 10000000000;

//
var angle = 360.0;
var x1 =200;
var y1 =350;
// var d = 180;
var dx = 960;
var dy = 540;

// var x2 =350;
// var y2 =200;

var cx=0;
var cy=0;

var f=1;
var f2 = 2;

// var p=0;
//axis margins
var ax = 80;
var ay = 80;

var play = 1;
p = [];
//createCanvas
var canvas;


function loadAccelData(){
	start = new Date(table.getNum(0, 0)*1000);
	for (var r = 0; r < table.getRowCount(); r++)
    {

      tstamp  = table.getNum(r, 0);

      row = {
      	"timestamp":tstamp,
      	"x":table.getNum(r, 1),
      	"y":table.getNum(r, 2),
      	"z":table.getNum(r, 3)
      }
      cur = new Date(tstamp*1000);

      // console.log(cur-start);
      timestamps.push(tstamp)
      rows.push(row);
      if (tstamp > max_time){
      	max_time = tstamp;
      }
      if(tstamp < min_time){

      	min_time = tstamp;
      }
    }

}

function preload() {
  table = loadTable("assets/data/drill1.csv", "csv", "header");
}

function setup() {
  canvas = createCanvas(1200, 1080);

  drill = createVideo('assets/drill1_small.mp4');
  button = createButton('play');

  button.mousePressed(toggleVid); // attach button listener
  loadAccelData();
  // print(table.getRowCount() + " total rows in table");
	drill.hide(); // by default video shows up in separate dom
  smooth();
  noFill();

}

prevX = 0;
prevY = 0;

function draw() {
	background(0);
  stroke(220);
// guide lines
//sin

 	image(drill, 50,50);
	if(drill.loadedmetadata){
		var idx;
		for (var i = 0; i < timestamps.length; i++) {
			cur = new Date(Math.floor(timestamps[i]*1000));
			start = new Date(Math.floor(timestamps[0]*1000));
			diff = (cur -start)/1000;


			if(drill.time() - diff < 0.0001){
				// console.log((drill.time() - diff))

				time = map(drill.time(),0,drill.duration(),0,width);
				line(cx+time,cy-dy,cx+time,cy+dy);
				time = cx + time;
				x =  map(rows[i].x, -2, 2, height/3, 0);
				y =  map(rows[i].y, -2, 2, (2/3)*height, height/3);
				z =  map(rows[i].z, -2, 2, height, height*(2/3));
				// var y = map(rows[i].z, -1, 1, height/2, 0);
				// fill(237,34,93);
				// ellipse(time,y,10,10);
				if(drill.duration() - drill.time() >0.001){
					p.push({"x":x,"y":y,"z":z,"time":time})
				}


				break;
			}
			else{

			}
		}
	}
	noFill();
	// drawGridLines();
	drawAnimated();
	drawEllipses();
	// drawGraph();
}

function drawGridLines(){
	noFill();
	stroke(220);
	line(cx+dx*0.25,cy-dy,cx+dx*0.25,cy+dy);
	line(cx+dx*0.5,cy-dy,cx+dx*0.5,cy+dy);
	line(cx+dx*0.75,cy-dy,cx+dx*0.75,cy+dy);
	line(cx+dx,cy-dy,cx+dx,cy+dy);
}
function drawEllipses(){
	var idx = p.length -1;
	if(idx < 0){
		return;
	}
	// console.log(idx)
	fill(237,34,93);
	stroke(237,34,93);
	ellipse(p[idx].time, p[idx].y,10,10);

	fill(237,504,93);
	stroke(237,504,93);

	ellipse(p[idx].time, p[idx].x,10,10);

	fill(10,504,200);
	stroke(10,504,200);
	ellipse(p[idx].time, p[idx].z,10,10);

}
function drawAnimated(){
	strokeWeight(1);
	beginShape();
	for (var i = 0; i < p.length; i++){
		stroke(237,34,93);
		vertex(p[i].time, p[i].y);
	}
	endShape();

	beginShape();
	for (var i = 0; i < p.length; i++){
		stroke(237,504,93);
		vertex(p[i].time, p[i].x);
	}
	endShape();

	beginShape();
	for (var i = 0; i < p.length; i++){
		stroke(10,504,200);
		vertex(p[i].time, p[i].z);
	}
	endShape();

}
function drawGraph(){
  beginShape();
  strokeWeight(1);
  noFill();
  stroke(220);
  for (var i = 0; i < timestamps.length; i++){
    var x = map(timestamps[i], min_time, max_time, 0, width);
    // table.getNum(r, 0)
    // var y = map(rows[i].x, -1, 1, height/2, 0);
    var y = map(rows[i].y, -1, 1, height/2, 0);
    vertex(x, y);
  }
  endShape();
}
function toggleVid() {

  if (playing) {
    drill.pause();

    button.html('play');
  } else {
    drill.play();
// print('play');
    button.html('pause');
  }
  playing = !playing;
}
