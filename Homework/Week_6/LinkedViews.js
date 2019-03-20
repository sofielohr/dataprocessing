// Sofie Löhr, 11038926

// loading data
var requests = [d3v5.json("data.json")];

Promise.all(requests).then(function(response) {
	var map = process(response);
	var piedata = map.AFG.pie;
	worldmap(map);
	piechart(piedata);
});

function process(input) {
	// initialize variables
	var map  = {};

	// make dataset
	Object.values(input[0]).forEach(function(d){
		// only 2014
		if (d.year == 2014) {
			var country_variables = {};
			country_variables.country = d.country
			country_variables.year = d.year
			country_variables[d.record] = d.total
			country_variables.pie = []
			for (var i = 4; i < 10; i++){
				pievalues = {}
				pievalues.label = Object.keys(d)[i]
				pievalues.value = d[Object.keys(d)[i]]
				country_variables.pie.push(pievalues)
			}				

			// calculate the fill category datamap
			if (country_variables.EFConsPerCap < 3){
				country_variables.fillKey = "low"
			}
			else if (country_variables.EFConsPerCap >= 3 && country_variables.EFConsPerCap < 6){
				country_variables.fillKey = "medium"
			}
			else if (country_variables.EFConsPerCap >= 6 && country_variables.EFConsPerCap < 9){
				country_variables.fillKey = "high"
			}
			else if (country_variables.EFConsPerCap >= 9){
				country_variables.fillKey = "super high"
			}

			map[d.CountryCode] = country_variables
		}
	})

	return map;

}

function worldmap(input){

	var datamap = new Datamap({
		element: document.getElementById("container_map"),
		data: input,
		fills: {
			"low": "#6EF172",
			"medium": "#59C15C",
			"high": "#448E46",
			"super high": "#2E5A2F",
			defaultFill: "#E0EBE0"
		}
	});
}

function piechart(input){
	// set width hight radius
	var w = 400
	var h = 400
	var radius = 100

	// set legend dimensions
	var legendRectSize = 25
	var legendSpacing = 6

	// define color scale
	var color = d3v5.scaleOrdinal(d3v5.schemePastel1)

	var svg = d3v5.select("#chart")
		.append("svg")
			.attr("width", w)
			.attr("height", h)
		.append("g")
			.attr("transform", "translate(" + 100 + "," + 200 + ")")

	var arc = d3v5.arc()
		.innerRadius(0)
		.outerRadius(radius)

	var pie = d3v5.pie()
		.sort(null)
		.value(function(d){ return d.value; })(input)	

	var path = svg.selectAll('path')
		.data(pie)
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', function(d){ return color(d.data.value); })

	
	// legend
	var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d,i){
			var height = legendRectSize +legendSpacing
			var offset = 100 * color.domain().length / 2
			var horz = 5 * legendRectSize
			var vert = i * h - offset
			return "translate(" + horz + "," + vert + ")";
		})

	legend.append("rect")
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("stroke", color)
		.append("text")
		.attr("x", legendRectSize + legendSpacing)
		.attr("y", legendRectSize - legendSpacing)
		.text(function(d){ return d; })
}

// function worldmap(input) {
	// process data
	
// 	// iterate over countries
// 	Object.values(input[0]).forEach(function(d){
// 		// iterate over years
// 		d.forEach(function(e) {
// 			// make object for country
// 			var land = {};
// 			land.country = e.Country;
// 			land.GDP = e.Datapoint;
			
// 			// add object for country to the right year
// 			clean_data[e.Year].push(land);
// 		});
// 	});

// 	// process ppp and tourists datasets and add to clean_data
// 	valuesFun(input[1], "PPP");
// 	valuesFun(input[2], "tourists");

// 	delCountries([clean_data["2012"]])

// 	// width & height
// 	var w = 800;
// 	var h = 600;

// 	var svg = d3.select("body")
// 				.append("svg")
// 				.attr("width", w)
// 				.attr("height", h);
// 	var tip = d3.tip()
//                     .attr('class', 'd3-tip')
//                     .offset([-10, 0])
//                     .html(function(d) { return "<strong>Country:</strong> <span style='color:darkcyan'>" + d.country + "</span><br/><strong>GDP:</strong> <span style='color:darkcyan'>" + d.GDP + "</span></span><br/><strong>PPP:</strong> <span style='color:darkcyan'>" + d.PPP + "</span>"; });

// 	// scales and axis
// 	var padding = 40;
// 	var xScale = d3.scaleLinear()
// 					.domain([0, d3.max(clean_data["2012"], function(d) {return d.PPP; })])
// 					.rangeRound([padding*1.5, w - padding]);
//     var yScale = d3.scaleLinear()
// 					.domain([d3.min(clean_data["2012"], function(d){ return d.GDP; }),  d3.max(clean_data["2012"], function(d) { return d.GDP; })])
// 					.rangeRound([h - padding, padding]);
// 	var colorScale = d3.scaleSequential(d3.interpolateCool)
// 					.domain([0, d3.max(clean_data["2012"], function(d){ return d.tourists; })]);

// 	var xAxis = d3.axisBottom(xScale)
// 					.ticks(8);
// 	var yAxis = d3.axisLeft(yScale)
// 					.ticks(8)
// 					.tickFormat(d3.format(".0s"));
// 	var colorLegend = d3.legendColor(colorScale);

// 	svg.call(tip);
	
// 	// create axis and labels
// 	svg.append("g")
// 		.attr("class", "axis")
// 		.attr("transform", "translate(" + 0 + "," + (h - padding) + ")")
// 		.call(xAxis);
//     svg.append("text")
// 		.attr("transform", "translate(" + w/2 + "," + (h - padding/2) + ")")
// 		.style("text-anchor", "start")
// 		.style("alignment-baseline", "hanging")
// 		.text("PPP");

// 	svg.append("g")
// 		.attr("class", "axis")
// 		.attr("transform", "translate(" + padding*1.5 + "," + 0 + ")")
// 		.call(yAxis);
// 	svg.append("text")
// 		.attr("transform", "rotate(-90)")
// 		.attr("x", - (h / 2))
// 		.attr("y", padding/1.5)
// 		.attr("text-anchor", "middle")
// 		.text("GDP");
// 	svg.append("g")
// 		.attr("class", "legend")
// 		.attr("transform", "translate(" + 2*padding + "," + padding + ")")
// 		.call(colorLegend);

// 	//create actual cirkels
// 	svg.selectAll("circle")
// 		.data(clean_data["2012"])
// 		.enter()
// 		.append("circle")
// 		.attr("cx", function(d){
// 			return xScale(d.PPP);
// 		})
// 		.attr("cy", function(d){
// 			return yScale(d.GDP);			
// 		})
// 		.attr("r", 5)
// 		.attr("fill", function(d){
// 			return colorScale(d.tourists);
// 		});

// }

// function valuesFun(i, name) {
// 	// INPUT DATA: iterate over countries
// 	Object.values(i).forEach(function(d){
// 		// INPUT DATA: iterate over years in input data
// 		d.forEach(function(e) {
// 			// CLEAN DATA: if year in cleandata -> select the right year & country
// 			if (typeof(clean_data[e.Time]) !== "undefined") {
// 				clean_data[e.Time].forEach(function(f){
// 					if (f.country === e.Country) {
// 						// add the datapoint to clean_data variable
// 						f[name] = e.Datapoint;
// 					};
// 				});
// 			};
// 		});
// 	});
// };

// function delCountries(data) {
// 	Object.values(data).forEach(function(d){
// 		d.forEach(function(e){
// 			if (typeof(e.PPP) == "undefined") {
// 				d.splice(d.indexOf(e), 1);
// 			}
// 			else if (typeof(e.tourists) == "undefined"){
// 				d.splice(d.indexOf(e), 1);
// 			};
// 		});
// 	});
// };



