var rawData;
var svg, x, y;
var margin = {top: 20, right: 30, bottom: 30, left: 40};
var width = 900 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

$(function() {  
	$.getJSON('ucla_enrollment.json', function(data) {
			rawData = data;
			// TODO: find an elegant solution
			x = d3.scale.ordinal().rangeRoundBands([0, width], .1).domain(_.keys(data.Art));
			//y = d3.scale.linear().range([height, 0]).domain([0, 1898]);
			y = d3.scale.linear().range([height, 0]).domain([0, 1000]);  // 1898 is simply too big...
			plotChart('Computer Science');
	});
});

function plotChart(key) {

	var data = rawData[key];  // TODO: handle KeyError
	var keys = _.keys(data), values = _.values(data);  // TODO: redesign data structure

	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

	svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Students");

  svg.selectAll(".bar")
      .data(keys)
    .enter().append("rect")
      .attr("class", "bar fill-aqua")
      .attr("x", function(d) { 
      	return x(d); 
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(data[d]); })
      .attr("height", function(d) { return height - y(data[d]);})
      .attr("fill", function(d) {
      	// TODO: set meaningful color
      	return randomColor();
      });
}

function clickButton() {
	var majors = _.keys(rawData);
	var key = majors[_.random(0, majors.length - 1)];
	$('#major-title').text(key);
	changeTo(key);
}

function changeTo(key) {
	var data = rawData[key];  // TODO: handle KeyError
	// http://bl.ocks.org/mbostock/3885705
	var transition = svg.transition().duration(300);  // TODO: customize delay
	transition.selectAll(".bar")
						.attr("y", function(d) { return y(data[d]); })
      			.attr("height", function(d) { return height - y(data[d]);});
}