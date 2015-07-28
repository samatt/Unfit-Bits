var FitnessChart = function(s){
	
	var params = {
		w:1200,
		h:1080,
		v_path:"assets/drill.mp4",
		d_path:"assets/drill.csv"

	}

	var divParams = {
		"drill":{
			dataPath:"assets/drill"
		},
		"pendulum":{
			dataPath:"assets/pendulum"
		}
	}


	var playing = false;
	var dataLoaded = false;
	var button,table,cavas,videoEl;
	var rows = [];
	var data =[];
	
	var timestamps =[]
	var max_time = 0;
	var min_time = 10000000000;
	var angle = 360.0;
	var x1 =200;
	var y1 =350;

	var dx = 960;
	var dy = 540;
	var width = 960;
	var height = 540;
	var cx=0;
	var cy=0;

	s.setup = function(){
		// console.log(s._userNode.id);
		var id = s._userNode.id;
		if(loadDataForDiv(id)){
			dataLoaded = true;
		}
		// canvas = s.createCanvas(960, 540);
		// videoEl = s.createVideo(params.v_path);
		// var table = s.loadTable(params.d_path, ["csv","header"],loadData);
		// button = s.createButton('play');
		// button.mousePressed(toggleVid); // attach button listener
		// s.smooth();
		// s.noFill();
	}

	s.draw = function() {

		if(dataLoaded && videoEl.loadedmetadata){
			var idx;
			for (var i = 0; i < timestamps.length; i++) {
				cur = new Date(Math.floor(timestamps[i]*1000));
				start = new Date(Math.floor(timestamps[0]*1000));
				diff = (cur -start)/1000;


				if(videoEl.time() - diff < 0.0001){
					time = s.map(videoEl.time(),0,videoEl.duration(),0,width);
					s.line(cx+time,cy-dy,cx+time,cy+dy);
					time = cx + time;
					x =  s.map(rows[i].x, -2, 2, height/3, 0);
					y =  s.map(rows[i].y, -2, 2, (2/3)*height, height/3);
					z =  s.map(rows[i].z, -2, 2, height, height*(2/3));
					if(videoEl.duration() - videoEl.time() >0.001){
						data.push({"x":x,"y":y,"z":z,"time":time})
					}
					break;
				}
				else{

				}
			}
		}
		s.noFill();
		drawAnimated();
		drawEllipses();
		drawGridLines();
	}

	function loadDataForDiv(id){
		// console.log(Object.keys(divParams));
		if(id in divParams){
			console.log(id);
			canvas = s.createCanvas(960, 540);
			videoEl = s.createVideo(divParams[id].dataPath+".mp4");
			var table = s.loadTable(divParams[id].dataPath+".csv", ["csv","header"],loadData);
			button = s.createButton('play');
			button.mousePressed(toggleVid); // attach button listener
			s.smooth();
			s.noFill();
			return 1;
		}
		else{
			console.log("No data for div ID : "+ id)
			return 0;
		}
	}

		function loadData(table){
		console.log(table.getRowCount());
		start = new Date(table.getNum(1, 0)*1000);

		for (var r = 1; r < table.getRowCount(); r++){
			tstamp  = table.getNum(r, 0);
			
			var row = {
				"timestamp":tstamp,
				"x":table.getNum(r, 1),
				"y":table.getNum(r, 2),
				"z":table.getNum(r, 3)
			}
			cur = new Date(tstamp*1000);
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

	function drawGridLines(){
		s.noFill();
		s.stroke(220);
		s.line(cx+dx*0.25,cy-dy,cx+dx*0.25,cy+dy);
		s.line(cx+dx*0.5,cy-dy,cx+dx*0.5,cy+dy);
		s.line(cx+dx*0.75,cy-dy,cx+dx*0.75,cy+dy);
		s.line(cx+dx,cy-dy,cx+dx,cy+dy);
	}
	function drawEllipses(){
		var idx = data.length -1;
		if(idx < 0){
			return;
		}
		// console.log(idx)
		s.fill(237,34,93);
		s.stroke(237,34,93);
		s.ellipse(data[idx].time, data[idx].y,10,10);

		s.fill(237,504,93);
		s.stroke(237,504,93);

		s.ellipse(data[idx].time, data[idx].x,10,10);

		s.fill(10,504,200);
		s.stroke(10,504,200);
		s.ellipse(data[idx].time, data[idx].z,10,10);

	}
	function drawAnimated(){
		// s.strokeWeight(1);
		s.beginShape();
		for (var i = 0; i < data.length; i++){
			s.stroke(237,504,93);
			s.vertex(data[i].time, data[i].x);
		}
		s.endShape();

		

		s.beginShape();
		for (var i = 0; i < data.length; i++){
			s.stroke(237,34,93);
			s.vertex(data[i].time, data[i].y);
		}
		s.endShape();

		s.beginShape();
		for (var i = 0; i < data.length; i++){
			s.stroke(10,504,200);
			s.vertex(data[i].time, data[i].z);
		}
		s.endShape();
	}

	function toggleVid() {
		if (playing) {
			videoEl.pause();

			button.html('play');
		} else {
			videoEl.play();
			console.log('play');
			button.html('pause');
		}
		playing = !playing;
	}


};

window.onload = function() {
  var containerNode = document.getElementById( 'drill' );
  var myp5 = new p5(FitnessChart, containerNode);
  var containerNode1 = document.getElementById( 'pendulum' );
  var myp5 = new p5(FitnessChart, containerNode1);
  // var myp5 = new p5(FitnessChart, containerNode);
};