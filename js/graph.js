var graphModule = (function(){

  //hard coding values for testing
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

  var margin = {top: 20, right: 30, bottom: 30, left: 40},
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
      .orient("left");

  
  var chart;
  
  function start(p){
    //hard coding values for testing
    params = p||params;
    console.log("start");
    init(params.file);
    draw(params.file);
    intervalId = setInterval(update,5000);
  }

  function update(){
    console.log("update");
    params.index = params.index>=(params.files.length-1)?0:(params.index+=1);
    console.log(params.index + " : "+params.files.length);
    params.file = params.files[params.index];
    draw(params.file);
  }

  function stop(){
    console.log("stop");
    clearInterval(intervalId);
  }

  function init(filename){
      // margin = {top:0, right:0, bottom:30, left:0};
      margin = {top: 40, right: 30, bottom: 30, left: 40},
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
        .orient("left");
    
    d3.tsv(filename, type, function(error, data) {
      
      x.domain(data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

      chart = d3.select(params.selector)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      chart.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      chart.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .attr("width", x.rangeBand());
    });

  }
  //"data-alt.tsv"
  function draw(alt_f) {

      // Get the data again
      d3.tsv(alt_f, type,function(error, data) {
        
        // Scale the range of the data again 
        x.domain(data.map( function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);
        console.log(y.range());
        
        var bar =  d3.select(params.selector)
                    .selectAll("rect")
                    .data(data);   
            
            bar.exit().remove();

            bar.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.name); })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .attr("width", x.rangeBand());

        // Select the section we want to apply our changes to
        var svg = d3.select(params.selector).transition();
            
            svg.selectAll(".bar")
              .duration(750)
                .attr("x", function(d) { return x(d.name); })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .attr("width", x.rangeBand());

            svg.select(".x") // change the x axis
                .duration(750)
                // .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.select(".y") // change the y axis
                .duration(750)
                .call(yAxis);
        // Make the changes

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

})();

