var rawData, data, ev;
var keys = ["Graduate Total", "Professional Practice", "Interns and Residents", "Professional Masters", "Academic Masters", "Undergraduate", "Doctorate", "Total Campus"];
var svg, x, y, xAxis, yAxis;
var margin = {top: 20, right: 30, bottom: 30, left: 40};
var width = 900 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

$(function() {
	$.getJSON('ucla_enrollment.json', function(data) {
			rawData = data;
			dict = []
			var majors = _.keys(rawData);
			for (i = 0; i < majors.length; i ++)
				dict.push({id:majors[i], text:majors[i]});
			$("select#major-select").select2({data: dict});
			$("select#major-select").on("select2:select", function (e) {  changeTo(e.params.data.id);}  );

			// TODO: find an elegant solution
			x = d3.scale.ordinal().rangeRoundBands([0, width], .1).domain(keys);
			//y = d3.scale.linear().range([height, 0]).domain([0, 1898]);
			y = d3.scale.linear().range([height, 0]).domain([0, 1000]);  // 1898 is simply too big...
			plotChart('Computer Science');
	});
});

function plotChart(key) {

	data = rawData[key];  // TODO: handle KeyError
	var values = _.values(data);  // TODO: redesign data structure

	xAxis = d3.svg.axis().scale(x).orient("bottom");
	yAxis = d3.svg.axis().scale(y).orient("left");

	svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tip = d3.tip()
							.attr("class", "tooltip")
							.offset([-10, 0])
							.html(function(d) {
								return "<span>" + data[d] + "</span>";
							});
	svg.call(tip);

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
      	return "hsla(177,100%," + (50 - data[d]/50) + "%,1)";
      	//return randomColor({luminosity: 'light'});
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
}

function clickButton() {
	var majors = _.keys(rawData);
	var key = majors[_.random(0, majors.length - 1)];
	changeTo(key);
}

function changeTo(key) {
	$('#major-title').text(key);
	data = rawData[key];  // TODO: handle KeyError
	// http://bl.ocks.org/mbostock/3885705
	y.domain([0, d3.max(_.values(data))])
	var transition = svg.transition().duration(400);  // TODO: customize delay
	transition.selectAll(".bar")
						.attr("y", function(d) { return y(data[d]); })
      			.attr("height", function(d) { return height - y(data[d]);})
      			.attr("fill", function(d) {
      				return "hsla(177,100%," + (52 - data[d]/20) + "%,1)";
      				//return randomColor({luminosity: 'light'});
      			});
  svg.select(".y.axis")
  		.transition().duration(400)
			.ease("sin-in-out") 
			.call(yAxis);
}