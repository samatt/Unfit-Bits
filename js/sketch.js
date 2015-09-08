var sketch = function(p){
	var spoofs = ['swing','bike','drill'];
	//"drill",'pendulum',
	var panels = [];

	p.setup = function(){
		
		var panelWidth = window.innerWidth;
		var panelHeight = window.innerHeight;
		var yOffset = 10;
		
		for (var i = 0; i < spoofs.length; i++) {
			var panel = new Panel(p,spoofs[i],panelWidth,panelHeight,yOffset);			
			yOffset = panel.offset+100;
			console.log(panel.offset);
			panels.push(panel);
		};
		var elem = document.getElementById("defaultCanvas");
		elem.parentNode.removeChild(elem);

		// while(!panels[0].videoLoaded && !panels[1].videoLoaded){
		// 	// console.log("allLoaded")
		
		// }
	}

	p.draw = function() {
		// console.log(panels[0].videoLoaded,panels[1].videoLoaded);
		for (var i = 0; i < panels.length; i++) {
			panels[i].draw();
		};
	}
	p.keyPressed = function() {
  		// console.log("Here");
  		for (var i = 0; i < panels.length; i++) {
			panels[i].clearCanvas();
		};
	}

	// function checkLoaded(){
	// 	var allLoaded = 
	// 	for (var i = 0; i < panels.length; i++) {
	// 		panels[i].videoLoaded 
	// 	}
	// }
}

function Panel(p,id,w,h,yOffset){
	
	this.tMax = 0;
	this.tMin = 10000000000;
	this.dataPath = "assets/"+id
	this.timestamps = [];
	this.rows = []
	this.data = [];
	this.dataLoaded = false;

	var cx = 0;
	var cy = 0
	this.idx =0;
	this.id = id;
	this.playing = false;
	this.offset = 0;
	this.offset  = yOffset; 
	this.padding = 20;
	this.videoLoaded = false;

	//LOAD DATA AND ELEMENTS
	this.createVideo = function(){
		this.v_p =  p.createDiv("");
		this.v_p.id(id+'-video-parent')
		this.v_p.width = this.colWidth;
		this.v_p.position(0,this.offset);
		this.v_p.class("sub");
		this.v_e = p.createVideo(this.dataPath+".mp4");
		this.v_e.parent(id+'-video-parent');
		this.v_e.id(id+'-video');
		this.v_e.size(this.colWidth,"auto"); 
		
		
		
		var el = document.getElementById(id+"-video");

		// el.addEventListener('canplaythrough',onLoaded);
		el.addEventListener('pause',onPaused.bind(this));
		el.addEventListener('ended',onEnded.bind(this));
		

		this.colWidth = this.v_e.width;
		this.colHeight = this.v_e.height;
	}
	function onLoaded(evt){
		console.log("Loaded");
		// console.log(this);
		// this.videoLoaded = true;
		// this.v_e.play();
	}
	function onPlaying(evt){
		console.log("Playing "+evt.srcElement.id );
	}

	function onPaused(evt){
		console.log("Paused "+evt.srcElement.id );
	}

	function onEnded(evt){
		console.log("Ended "+evt.srcElement.id );
		this.data = [];
		this.clearCanvas();
		this.v_e.currentTime = 0;
		this.v_e.play();

	}
	
	this.createCanvas = function(){
		this.c_p =  p.createDiv("");
		this.c_p.id(id+'-canvas-parent')
		this.c_p.width = this.colWidth ;
		this.c_p.height = this.colHeight ;
		this.c_p.position(this.colWidth,this.offset);
		this.c_p.class("right");
		this.c_p.class("sub");
		this.canvas = p.createGraphics(this.colWidth - this.padding, this.colHeight);
		this.canvas.show();
		this.canvas.id(id+'-canvas')
		this.canvas.parent(id+'-canvas-parent');
	}
	
	this.createButton = function(){
		this.button = p.createButton('Play '+id);
		//FIXME: Make this dependent on the width of the window
		this.button.position(0,this.offset+50);		
		this.button.class("btn");
	}

	this.createImage = function(){
		this.image = p.createImg(this.dataPath+"-app.png");
		this.image.size(this.colWidth,this.colHeight);
		this.image.style("position","absolute");
		this.image.style("left",(this.colWidth*2).toString()+"px");
		this.image.style("top",this.offset.toString()+"px");
		this.image.class("sub");
	}
	this.heading = function(){
		this.heading = p.createElement("h2");
		var textPos = this.offset;
		this.heading.id(id+'-heading');
		this.heading.html(id);
		// this.heading.style('color','white');
		this.heading.class('heading');
		this.heading.style("position","absolute");
		this.heading.style("left","0px");
		this.heading.style("top",textPos.toString()+"px")
		this.heading.style('width',w);
		this.heading.style('height',this.colHeight);

		//FIXME: Make this dependent on the width of the window
		this.offset  = this.offset + this.heading.elt.clientHeight + 20;
	}

	this.text = function(){

		//FIXME: Make this dependent on the width of the window 
		// var textPos = 10 +this.offset;
		this.text = p.createP("STEP COUNT : 100" )
		// this.text = p.createP("HERE IS MY TEST TEXT FOR " + id.toUpperCase())
		this.text.id(id+'-text');
		this.text.style("position","absolute");
		this.text.style("left","0px");
		this.text.style("top",textPos.toString()+"px")
		this.text.style('width',this.colWidth);
		this.text.style('height',this.colHeight);
		this.text.class("text");
		this.text.class("sub");
		this.offset  = this.offset + this.text.height;
	}

	this.loadData = function(table){
		// console.log(table);
		for (var r = 1; r < table.getRowCount(); r++){
			var tstamp  = table.getNum(r, 0);
			var row = {
				"timestamp":tstamp,
				"x":table.getNum(r, 1),
				"y":table.getNum(r, 2),
				"z":table.getNum(r, 3)
			}

			this.timestamps.push(tstamp)
			this.rows.push(row);
			if (tstamp > this.tMax){
				this.tMax = tstamp;
			}
			if(tstamp < this.tMin){
				this.tMin = tstamp;
			}
		}
		this.dataLoaded = true;
	}

	this.getDuration = function(){
		for (var i = 0; i < timestamps.length; i++) {
			timestamps[i]
		};

	}

	this.toggleVid = function () {
		if (this.playing) {
			this.v_e.pause();
			this.button.html('play');
		} 
		else {
			this.v_e.play();
			this.button.html('pause');
		}
		this.playing = !this.playing;
	}

	///MAIN LOGIC
	// Order of function calls is important

	this.numCols = 3;
	this.colWidth = w/this.numCols;
	//Col height is reset with the video;
	this.colHeight = h;	
	this.heading();
	this.createVideo();
	this.createCanvas()
	this.createImage();
	this.offset = this.offset + this.v_e.height;
	// this.text();
	this.createButton();
	p.loadTable(this.dataPath+".csv", ["csv","header"],this.loadData.bind(this));
	this.button.mousePressed(this.toggleVid.bind(this)); 
	// console.log(this.text);

	// DRAWING STUFF

	this.drawGridLines =function(){
		this.canvas.stroke(220);
		this.canvas.line(cx+this.colWidth*0.25,cy-this.colHeight,cx+this.colWidth*0.25,cy+this.colHeight);
		this.canvas.line(cx+this.colWidth*0.5,cy-this.colHeight,cx+this.colWidth*0.5,cy+this.colHeight);
		this.canvas.line(cx+this.colWidth*0.75,cy-this.colHeight,cx+this.colWidth*0.75,cy+this.colHeight);
		this.canvas.line(cx+this.colWidth,cy-this.colHeight,cx+this.colWidth,cy+this.colHeight);
	}

	this.draw = function(){

		if(this.dataLoaded && this.v_e.loadedmetadata){
		var idx;
			for (var i = 0; i < this.timestamps.length; i++) {
				var cur = new Date(Math.floor(this.timestamps[i]*1000));
				var start = new Date(Math.floor(this.timestamps[0]*1000));
				var diff = (cur -start)/1000;

				if(this.v_e.time() - diff < 0.0001){
					var time = p.map(this.v_e.time(),0,this.v_e.duration(),0,this.colWidth);
					p.line(cx+time,cy-this.colHeight,cx+time,cy+this.colHeight);
					time = cx + time;
					x =  p.map(this.rows[i].x, -3, 3, this.colHeight/3, 0);
					y =  p.map(this.rows[i].y, -3, 3, (2/3)*this.colHeight, this.colHeight/3);
					z =  p.map(this.rows[i].z, -3, 3, this.colHeight, this.colHeight*(2/3));
					if(this.v_e.duration() - this.v_e.time() >0.001){
						this.data.push({"x":x,"y":y,"z":z,"time":time})
					}
					break;
				}
			}
		}
		this.canvas.noFill();
		this.drawAnimated();
	}
	this.drawEllipses = function (){
		this.idx = this.data.length -1;
		if(this.idx < 0){
			return;
		}
		// 5873a5
		this.canvas.fill(88,115,165);
		// this.canvas.fill(237,34,93);
		// this.canvas.stroke(237,34,93);
		this.canvas.ellipse(this.data[this.idx].time, this.data[this.idx].y,1,1);
		
		this.canvas.fill(88,115,165);
		// this.canvas.fill(237,504,93);
		// this.canvas.stroke(237,504,93);

		this.canvas.ellipse(this.data[this.idx].time, this.data[this.idx].x,1,1);

		this.canvas.fill(88,115,165);
		// this.canvas.fill(10,504,200);
		// this.canvas.stroke(10,504,200);
		this.canvas.ellipse(this.data[this.idx].time, this.data[this.idx].z,1,1);

	}

	this.clearCanvas = function(){
		this.canvas.clear();
	}

	this.drawAnimated = function(){
		this.canvas.beginShape();
		for (var i = 0; i < this.data.length; i++){
			this.canvas.stroke(88,115,165);
			// this.canvas.stroke(237,504,93);
			this.canvas.vertex(this.data[i].time, this.data[i].x);
		}
		this.canvas.endShape();

		this.canvas.beginShape();
		for (var i = 0; i < this.data.length; i++){
			this.canvas.stroke(88,115,165);
			// this.canvas.stroke(237,34,93);
			this.canvas.vertex(this.data[i].time, this.data[i].y);
		}
		this.canvas.endShape();

		this.canvas.beginShape();
		for (var i = 0; i < this.data.length; i++){
			this.canvas.stroke(88,115,165);
			// this.canvas.stroke(10,504,200);
			this.canvas.vertex(this.data[i].time, this.data[i].z);
		}
		this.canvas.endShape();
	}

	return this;

	
}

window.onload = function() {
  var containerNode = document.getElementById( 'page-top' );
  var myp5 = new p5(sketch, containerNode);
};