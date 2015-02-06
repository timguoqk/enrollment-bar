var rawData;
var w = 300, h = 250;
var barPadding = 1, padding = 20;

$(function() {	
	$.getJSON('ucla_enrollment.json', function(data) {
    	rawData = data;
    	initChart();
	});
});

function initChart() {
	var dict = rawData['Computer Science'];
	var labels = _.keys(dict);
	var values = _.values(dict);

	var yscale = d3.scale.linear()
						.domain([d3.min(values), d3.max(values)])
						.range([0, h-padding])
						.nice();
	var xscale = d3.scale.linear()
						.domain([0, labels.length-1])
						.range([0, w]);

	var svg = d3.select('#chart')
				.append('svg')
				.attr('width', w)
				.attr('height', h);

	svg.selectAll('rect')
		.data(values)
		.enter()
		.append('rect')
		.attr('x', function(d, i) {return i * w / values.length;})
		.attr('y', function(d) {
			return h-yscale(d)-padding;
		})
		.attr('width', w / values.length - barPadding)
		.attr('height', function(d) {
			return yscale(d);
		})
		.attr('fill', function(d) {
			return "rgb(0, 0, " + yscale(d) + ")";
		});

	// Axis
	var axis = d3.svg.axis()
					.scale(xscale)
					.tickFormat(labels);
	svg.append('g')
		.attr('class', 'axis')
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(axis);
	// d3.select("#chart").selectAll("div")
	//     .data(dataset)
	//     .enter()
	//     .append("div")
	//     .attr("class", "bar")
	//     .style("height", function(d) {
	// 	    var barHeight = d / 5;
	// 	    return barHeight + "px";
	// 	});
}

function clickButton() {
	dict = rawData['Art'];
	labels = _.keys(dict);
	dataset = _.values(dict);

	d3.select("#chart").selectAll("div")
	    .data(dataset)
	    .transition();
}