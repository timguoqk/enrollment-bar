var rawData;
// var w = 300, h = 250;
// var barPadding = 1, padding = 20;
var margin = {top: 20, right: 30, bottom: 30, left: 40};
var width = 960 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

$(function() {  
	$.getJSON('ucla_enrollment.json', function(data) {
			rawData = data;
			plotChart('Computer Science');
	});
});

function plotChart(key) {

	var data = rawData[key];  // TODO: handle KeyError
	var keys = _.keys(data), values = _.values(data);

	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

	var svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(keys);
  y.domain([0, d3.max(values)]);

  svg.append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y-axis axis")
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
      .attr("height", function(d) { return height - y(data[d]);});
}

// function initChart() {
//  // http://bl.ocks.org/mbostock/3885705
//  var dict = rawData['Computer Science'];
//  var labels = _.keys(dict);
//  var values = _.values(dict);

//  var yscale = d3.scale.linear()
//            .domain([d3.min(values), d3.max(values)])
//            .range([0, h-padding])
//            .nice();
//  var xscale = d3.scale.ordinal()
//            .domain(labels)
//            .rangeBands([0, w], .1);

//  var svg = d3.select('#chart')
//        .append('svg')
//        .attr('width', w)
//        .attr('height', h);

//  svg.selectAll('rect')
//    .data(values)
//    .enter()
//    .append('rect')
//    .attr('x', xscale.rangeBand() / 2)
//    .attr('y', function(d) {
//      return h-yscale(d)-padding;
//    })
//    .attr('width', w / values.length - barPadding)
//    .attr('height', function(d) {
//      return yscale(d);
//    })
//    .attr('fill', function(d) {
//      return "rgb(0, 0, " + yscale(d) + ")";
//    });

//  // Axis
//  var axis = d3.svg.axis()
//          .scale(xscale)
//          .tickFormat(labels);
//  svg.append('g')
//    .attr('class', 'axis')
//    .attr("transform", "translate(0," + (h - padding) + ")")
//    .call(axis);
//  // d3.select("#chart").selectAll("div")
//  //     .data(dataset)
//  //     .enter()
//  //     .append("div")
//  //     .attr("class", "bar")
//  //     .style("height", function(d) {
//  //      var barHeight = d / 5;
//  //      return barHeight + "px";
//  //  });
// }

function clickButton() {
	
}