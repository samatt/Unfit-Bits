var sketch = function(p){
	var spoofs = ["drill","pendulum"];
	var panels = [];

	p.setup = function(){
		
		var numRows = spoofs.length;
		var panelWidth = window.innerWidth;
		var panelHeight = window.innerHeight/spoofs.length;

		var yOffset = 100;
		for (var i = 0; i < spoofs.length; i++) {
			var panel = new Panel(p,spoofs[i],panelWidth,panelHeight,yOffset);
			yOffset =yOffset + panel.offset;
			panels.push(panel);
		};
	}

	p.draw = function() {
		for (var i = 0; i < panels.length; i++) {
			panels[i].draw();
		};
	}
}

function Panel(p,id,w,h,yOffset){
	
	this.tMax = 0;
	this.tMin = 10000000000;
	this.dataPath = "assets/"+id
	this.timestamps = [];
	this.rows = []
	this.data = [];
	this.dataLoaded = false;
	var numCols = 4;
	this.colWidth = w/numCols;
	this.colHeight = h;

	var cx = 0;
	var cy = 0
	this.idx =0;
	this.id = id;

	this.v_p =  p.createDiv("");
	this.v_p.id(id+'-video-parent')
	this.v_p.parent(id);
	this.v_p.width = this.colWidth;
	this.v_p.position(0,yOffset);
	
	this.v_e = p.createVideo(this.dataPath+".mp4");
	this.v_e.parent(id+'-video-parent');
	this.v_e.size(this.colWidth,"auto");
	
	this.colHeight = this.v_e.height ;

	this.c_p =  p.createDiv("");
	this.c_p.id(id+'-canvas-parent')
	this.c_p.parent(id);
	this.c_p.width = this.colWidth;
	this.c_p.height = this.colHeight ;
	this.c_p.position(this.colWidth,yOffset);
	this.c_p.class("right");
	this.canvas = p.createGraphics(this.colWidth, this.colHeight);
	this.canvas.show();
	this.canvas.id(id+'-canvas')
	this.canvas.parent(id+'-canvas-parent');

	this.button = p.createButton('play-'+id);
	this.button.position(this.colWidth*2,this.colHeight+yOffset);

	this.t_p = p.createDiv();
	this.t_p.id(id+'-text-parent')
	this.t_p.parent(id);
	this.t_p.width = this.colWidth;
	this.t_p.height = this.colHeight ;
	this.t_p.position(this.colWidth*2,yOffset);
	this.text = p.createP("HERE IS MY TEST TEXT FOR " + id.toUpperCase())
	this.text.parent(id+'-text-parent');
	this.text.class("text");

	this.playing = false;
	this.offset = 0;

	this.loadData = function(table){
		console.log(table);
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
					x =  p.map(this.rows[i].x, -2, 2, this.colHeight/3, 0);
					y =  p.map(this.rows[i].y, -2, 2, (2/3)*this.colHeight, this.colHeight/3);
					z =  p.map(this.rows[i].z, -2, 2, this.colHeight, this.colHeight*(2/3));
					if(this.v_e.duration() - this.v_e.time() >0.001){
						this.data.push({"x":x,"y":y,"z":z,"time":time})
					}
					break;
				}
			}
		}
		this.canvas.noFill();
		this.drawAnimated();
		// this.drawGridLines();
	}
	this.drawEllipses = function (){
		this.idx = this.data.length -1;
		if(this.idx < 0){
			return;
		}
		this.canvas.fill(237,34,93);
		this.canvas.stroke(237,34,93);
		this.canvas.ellipse(this.data[this.idx].time, this.data[this.idx].y,1,1);

		this.canvas.fill(237,504,93);
		this.canvas.stroke(237,504,93);

		this.canvas.ellipse(this.data[this.idx].time, this.data[this.idx].x,1,1);

		this.canvas.fill(10,504,200);
		this.canvas.stroke(10,504,200);
		this.canvas.ellipse(this.data[this.idx].time, this.data[this.idx].z,1,1);

	}
	this.drawAnimated = function(){
		// s.strokeWeight(1);
		this.canvas.beginShape();
		for (var i = 0; i < this.data.length; i++){
			this.canvas.stroke(237,504,93);
			this.canvas.vertex(this.data[i].time, this.data[i].x);
		}
		this.canvas.endShape();

		this.canvas.beginShape();
		for (var i = 0; i < this.data.length; i++){
			this.canvas.stroke(237,34,93);
			this.canvas.vertex(this.data[i].time, this.data[i].y);
		}
		this.canvas.endShape();

		this.canvas.beginShape();
		for (var i = 0; i < this.data.length; i++){
			this.canvas.stroke(10,504,200);
			this.canvas.vertex(this.data[i].time, this.data[i].z);
		}
		this.canvas.endShape();
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

	p.loadTable(this.dataPath+".csv", ["csv","header"],this.loadData.bind(this));
	this.button.mousePressed(this.toggleVid.bind(this)); 
	this.offset  = yOffset + this.colHeight; 
	
	return this;
}

window.onload = function() {
  var containerNode = document.getElementById( 'page-top' );
  var myp5 = new p5(sketch, containerNode);
};