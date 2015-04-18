var graphModule = (function(){

  //Used with d3_dev
  var params = {
    w : 960,
    h : 500,
    file : "../data/data.tsv",
    files : ['../data/data.tsv','../data/data-alt.tsv','../data/data.tsv',],
    index :0,    
    selector : ".chart",
    f : " "
  }
  intervalId : 0

  var filesInfo = 
  {
    "Distance": { "label": "Meters",
                  "title": "Distance Covered",
                  "unit" : 'm'
                },
    "Steps": { "label": "No. Of Steps",
                "title": "Steps Taken",
                "unit": "steps"
            },
    "Floors": { "label": "No. Of Floors",
                  "title": "Floors Climbed",
                  "unit": "floors"
              }
  }

  var margin = {top: 20, right: 10, bottom: 30, left: 40},
    width = params.w - margin.left - margin.right,
    height = params.h - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left").tickFormat("s");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<span style='color: rgba(74,193,192,1);'>" + d.value + " "+ d.unit+"</span>";
    });

  
  var chart;
  
  function start(p){
    //hard coding values for testing
    params = p||params;
    // console.log("start");
    init(params.file);
    draw(params.file);
    intervalId = setInterval(update,5000);
  }

  function update(){
    // console.log("update");
    params.index = params.index>=(params.files.length-1)?0:(params.index+=1);
    console.log(params.index + " : "+params.files.length);
    params.file = params.files[params.index];
    draw(params.file);
  }

  function stop(){
    // console.log("stop");
    clearInterval(intervalId);
  }

  function init(filename){
      // margin = {top:0, right:0, bottom:30, left:0};
      margin = {top: 50, right: 0, bottom: 30, left: 50},
        width = params.w - margin.left - margin.right;
        height = params.h - margin.top - margin.bottom;

      x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      y = d3.scale.linear()
          .range([height, 0]);

      xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
    .tickFormat(function(d) { 
        if(d >1000){
           return d3.format("s")(d);
        }
        else{
          return d;  
        }
      });
    
    d3.tsv(filename, type, function(error, data) {
      
      x.domain(data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);
      // console.log(y.domain());
      chart = d3.select(params.selector)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      chart.call(tip);
      chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      chart.append("g")
          .attr("class", "y axis")
          .style("text-anchor", "end")
          // .attr("transform", "translate("+width +",0 )")
          .call(yAxis);
          //Create Y axis label
      chart.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("x",0 )
          .attr("dy", "0.7em")
          .style("text-anchor", "end")
          .text("Weight");
      
      chart.append("text")
          .attr("class", "title")
          .attr("text-anchor", "end")
          // .attr("vertical-align", "top")
          .attr("y", 0 -margin.top -margin.bottom +40 )
          // .attr("x",width/2)
          .attr("x",0 )
          .attr("x",width - margin.right )
          .attr("dy", "0.7em")
          .text("Test");
          
    //Add rectangles

      chart.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) {  return height - y(d.value); })
          .attr("width", x.rangeBand())
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
    });

  }
  //"data-alt.tsv"
  function draw(alt_f) {

      // Get the data again
      
      d3.tsv(alt_f, type,function(error, data) {
        
        var key = alt_f.split(".")[0].split("/")[1];
        for(d in data){
          
          data[d].type = key;
          data[d].unit = filesInfo[key].unit;
          console.log(data[d]);

        }
        
        console.log(key);
        x.domain(data.map( function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);
        
        var bar =  d3.select(params.selector)
                    .selectAll("rect")
                    .data(data);   
            
            bar.exit().remove();

            bar.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.name); })
                .attr("y", function(d) {  return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .attr("width", x.rangeBand())
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

        var svg = d3.select(params.selector).transition();
            
            svg.selectAll(".bar")
              .duration(750)
                .attr("x", function(d) { return x(d.name); })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .attr("width", x.rangeBand());

            svg.select(".x")
                .duration(750)
                .call(xAxis);

            svg.select(".y")
                .duration(750)
                .call(yAxis);

            svg.select(".label")
                .duration(750)
                .style("opacity", 0)
                .transition().duration(500)
                .style("opacity", 1)
                .text(filesInfo[key].label);

            svg.select(".title")
                .duration(750)
                .style("opacity", 0)
                .transition().duration(500)
                .style("opacity", 1)
                .text(filesInfo[key].title);
      });

  }

  //helper for parser
  function type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }

  {
    return {
      start:start,
      stop:stop
    }
  }

});

