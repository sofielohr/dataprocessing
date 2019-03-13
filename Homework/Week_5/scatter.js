// Sofie Löhr, 11038926

// loading data
var requests = [d3.json("gdp.json"), d3.json("ppp.json"), d3.json("tourists.json")];

Promise.all(requests).then(function(response) {
    plotFun(response);
});

// initialize clean data
let clean_data = {
	"2012": [],
	"2013": [],
	"2014": [],
	"2015": [],
	"2016": [],
	"2017": [],
	"2018": []
};

function plotFun(input) {
	// process data
	
	// iterate over countries
	Object.values(input[0]).forEach(function(d){
		// iterate over years
		d.forEach(function(e) {
			// make object for country
			var land = {};
			land.country = e.Country;
			land.GDP = e.Datapoint;
			
			// add object for country to the right year
			clean_data[e.Year].push(land);
		});
	});

	// process ppp and tourists datasets and add to clean_data
	valuesFun(input[1], "PPP");
	valuesFun(input[2], "tourists");

	delCountries([clean_data["2012"]])

	// width & height
	var w = 800;
	var h = 600;

	var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);
	var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) { return "<strong>Country:</strong> <span style='color:darkcyan'>" + d.country + "</span><br/><strong>GDP:</strong> <span style='color:darkcyan'>" + d.GDP + "</span></span><br/><strong>PPP:</strong> <span style='color:darkcyan'>" + d.PPP + "</span>"; });

	// scales and axis
	var padding = 40;
	var xScale = d3.scaleLinear()
					.domain([0, d3.max(clean_data["2012"], function(d) {return d.PPP; })])
					.rangeRound([padding*1.5, w - padding]);
    var yScale = d3.scaleLinear()
					.domain([d3.min(clean_data["2012"], function(d){ return d.GDP; }),  d3.max(clean_data["2012"], function(d) { return d.GDP; })])
					.rangeRound([h - padding, padding]);
	var colorScale = d3.scaleSequential(d3.interpolateCool)
					.domain([0, d3.max(clean_data["2012"], function(d){ return d.tourists; })]);

	var xAxis = d3.axisBottom(xScale)
					.ticks(8);
	var yAxis = d3.axisLeft(yScale)
					.ticks(8)
					.tickFormat(d3.format(".0s"));
	var colorLegend = d3.legendColor(colorScale);

	svg.call(tip);
	
	// create axis and labels
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + 0 + "," + (h - padding) + ")")
		.call(xAxis);
    svg.append("text")
		.attr("transform", "translate(" + w/2 + "," + (h - padding/2) + ")")
		.style("text-anchor", "start")
		.style("alignment-baseline", "hanging")
		.text("PPP");

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding*1.5 + "," + 0 + ")")
		.call(yAxis);
	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", - (h / 2))
		.attr("y", padding/1.5)
		.attr("text-anchor", "middle")
		.text("GDP");
	svg.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(" + 2*padding + "," + padding + ")")
		.call(colorLegend);

	//create actual cirkels
	svg.selectAll("circle")
		.data(clean_data["2012"])
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return xScale(d.PPP);
		})
		.attr("cy", function(d){
			return yScale(d.GDP);			
		})
		.attr("r", 5)
		.attr("fill", function(d){
			return colorScale(d.tourists);
		});

}

function valuesFun(i, name) {
	// INPUT DATA: iterate over countries
	Object.values(i).forEach(function(d){
		// INPUT DATA: iterate over years in input data
		d.forEach(function(e) {
			// CLEAN DATA: if year in cleandata -> select the right year & country
			if (typeof(clean_data[e.Time]) !== "undefined") {
				clean_data[e.Time].forEach(function(f){
					if (f.country === e.Country) {
						// add the datapoint to clean_data variable
						f[name] = e.Datapoint;
					};
				});
			};
		});
	});
};

function delCountries(data) {
	Object.values(data).forEach(function(d){
		d.forEach(function(e){
			if (typeof(e.PPP) == "undefined") {
				d.splice(d.indexOf(e), 1);
			}
			else if (typeof(e.tourists) == "undefined"){
				d.splice(d.indexOf(e), 1);
			};
		});
	});
};



