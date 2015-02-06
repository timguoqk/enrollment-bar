var rawData;

$(function() {	
	$.getJSON('ucla_enrollment.json', function(data) {
    	rawData = data;
    	initChart();
	});
});

function initChart() {
	dict = rawData['Computer Science'];
	labels = _.keys(dict);
	dataset = _.values(dict);

	d3.select("#chart").selectAll("div")
	    .data(dataset)
	    .enter()
	    .append("div")
	    .attr("class", "bar")
	    .style("height", function(d) {
		    var barHeight = d / 5;
		    return barHeight + "px";
		});
}

function clickButton() {
	dict = rawData['Art'];
	labels = _.keys(dict);
	dataset = _.values(dict);

	d3.select("#chart").selectAll("div")
	    .data(dataset)
	    .transition();
}