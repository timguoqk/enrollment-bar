var rawData, data, ev;
var majors, sortedMajors, keys = ["Graduate Total", "Professional Practice", "Interns and Residents", "Professional Masters", "Academic Masters", "Undergraduate", "Doctorate", "Total Campus"];
var svg, x, y, colorScale, xAxis, yAxis;
var margin = {top: 20, right: 30, bottom: 30, left: 40};
var width = 900 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var crossMajorPlotted = false;

$(function() {
	$('.ui.checkbox').checkbox();
	$('#main-container').onepage_scroll({beforeMove: function(index) {
		if (index == 2 && !crossMajorPlotted) {
			crossMajorPlotted = true;
			plotChartCrossMajor();
		}
	}});
	$.getJSON('ucla_enrollment.json', function(data) {
			rawData = data;
			dict = []
			majors = _.sortBy(_.keys(rawData), function(key) {return key});
			sortedMajors = _.sortBy(majors, function(key){ return rawData[key]['Total Campus']});
			for (i = 0; i < majors.length; i ++)
				dict.push({id:majors[i], text:majors[i]});
			dict = _.sortBy(dict, function(x) { return x.id; });
			$("select#major-select").select2({data: dict});
			$("select#major-select").on("select2:select", function(e) { majorChangeTo(e.params.data.id);} );

			// TODO: find an elegant solution
			x = d3.scale.ordinal().rangeRoundBands([0, width], .1).domain(keys);
			y = d3.scale.linear().range([height, 0]);
			colorScale = d3.scale.linear().range([45, 15]).domain([0, 1898]);  // 1898 is simply too big...

			plotChartMajor('Aerospace Engineering');
	});
});

function plotChartMajor(key) {

	data = rawData[key];  // TODO: handle KeyError
	var values = _.values(data);  // TODO: redesign data structure

	y.domain([0, d3.max(_.values(data))])
	xAxis = d3.svg.axis().scale(x).orient("bottom");
	yAxis = d3.svg.axis().scale(y).orient("left");

	svg = d3.select("#chart-major").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tip = d3.tip()
							.attr("class", "tooltip")
							.html(function(d) {
								return "<div class='ui pointing below label'>" + data[d] + "</div>";
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
			.attr("class", "bar")
			.attr("x", function(d) { 
				return x(d); 
			})
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(data[d]); })
			.attr("height", function(d) { return height - y(data[d]);})
			.attr("fill", function(d) {
				return "hsla(177,100%," + colorScale(data[d]) + "%,1)";
			})
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide);
}

function majorRandom() {
	var key = majors[_.random(0, majors.length - 1)];
	majorChangeTo(key);
}

function majorChangeTo(key) {
	$('#major-title').text(key);
	data = rawData[key];
	y.domain([0, d3.max(_.values(data))])
	var transition = svg.transition().duration(400);  // TODO: customize delay
	transition.selectAll(".bar")
						.attr("y", function(d) { return y(data[d]); })
						.attr("height", function(d) { return height - y(data[d]);})
						.attr("fill", function(d) {
							return "hsla(177,100%," + colorScale(data[d]) + "%,1)";
						});
	svg.select(".y.axis")
			.transition().duration(400)
			.ease("sin-in-out") 
			.call(yAxis);
}

function plotChartCrossMajor() {
	// TODO: offset correctly
	var x = d3.scale.ordinal().rangeBands([0, width]).domain(majors);
	var y = d3.scale.linear().range([height, 0]).domain([0, 1898]);
	var colorScale = d3.scale.linear().range([45, 15]).domain([0, 1898]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

	var crossMajorSvg = d3.select("#chart-cross-majors").append("svg")
												.attr("width", width + margin.left + margin.right)
												.attr("height", height + margin.top + margin.bottom)
											.append("g")
												.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tip = d3.tip()
							.attr("class", "tooltip")
							.offset([-10, 0])
							.html(function(d) {
								return "<div class='ui pointing below label'>" + d + ": " + rawData[d]['Total Campus'] + "</div>";
							});
	crossMajorSvg.call(tip);

	crossMajorSvg.append("g")
							.attr("class", "y axis")
							.call(yAxis)
						.append("text")
							.attr("transform", "rotate(-90)")
							.attr("y", 6)
							.attr("dy", ".71em")
							.style("text-anchor", "end")
							.text("Total Students");

	crossMajorSvg.selectAll(".bar")
							.data(majors)
						.enter().append("rect")
							.attr("class", "bar")
							.attr("x", function(d) { 
								return x(d); 
							})
							.attr("width", x.rangeBand())
							.attr("y", height)
							.attr("height", 0)
							.on("mouseover", tip.show)
							.on("mouseout", tip.hide);

	var transition = crossMajorSvg.transition().duration(2500);
	transition.selectAll(".bar")
						.attr("y", function(d) { 
							return y(rawData[d]['Total Campus']); })
						.attr("height", function(d) { 
							return height - y(rawData[d]['Total Campus']); })
						.attr("fill", function(d) {
							return "hsla(177,100%," + colorScale(rawData[d]['Total Campus']) + "%,1)";
						});
	$("input[name='sort-checkbox']").on("change", changeCross);
	function changeCross() {
		var transition = crossMajorSvg.transition().duration(1500);
		if ($("input[name='sort-checkbox']").prop("checked"))
			x.domain(sortedMajors);
		else
			x.domain(majors);
		transition.selectAll(".bar")
							.attr("x", function(d) { 
								return x(d); 
							})
							.attr("y", function(d) { 
								return y(rawData[d]['Total Campus']); })
							.attr("height", function(d) { 
								return height - y(rawData[d]['Total Campus']); });
		// WARNING: There's no x axis yet
		transition.select(".x.axis")
							.ease("sin-in-out")
							.call(xAxis);
	}
}
