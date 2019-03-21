// Sofie Löhr, 11038926

// loading data
var requests = [d3v5.json("data.json")];

Promise.all(requests).then(function(response) {
	var map = process(response);
	console.log(map)
	worldmap(map);
	var piedata = map.ARM.pie;
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

		geographyConfig: {
			// pop up settings
	        popupTemplate: function(geography, data) {
	        	var EF = Math.round(data.EFConsPerCap * 100) / 100;
	        	return['<div class = "hoverinfo"><strong>'+
	            		geography.properties.name + 
	            		'<br/>EF: ' + EF +
	            		'</strong></div>'];},

	        // set highlight properties (upon mouseover)
	        highlightOnHover: true,
	        popupOnHover: true,
	        highlightFillColor: "#b5ccca",
	        highlightBorderColor: "#b5ccca"
	    },
		
		data: input,

		fills: {
			"low": "#6EF172",
			"medium": "#59C15C",
			"high": "#448E46",
			"super high": "#2E5A2F",
			defaultFill: "#E0EBE0"
		},

		// done: function(map) { 
		// 	var code = "ARM"

		// 	div.selectAll(".datamaps-subunit").on("click", function(geography){
		// 		code = geography.id;
		// 	})
		// }
	});
}

function piechart(input){
	// set width hight radius
	var w = 400
	var h = 400
	var radius = 100

	// set legend dimensions
	var legendRectSize = 25
	var legendSpacing = 3

	// define color scale
	var color = d3v5.scaleOrdinal(d3v5.schemePastel1)

	var svg = d3v5.select("#chart")
		.append("svg")
			.attr("width", w)
			.attr("height", h)
		.append("g")
			.attr("transform", "translate(" + 200 + "," + 200 + ")")

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

	// tooltip
	var tooltip = d3v5.select("#chart")
		.append("div")
			.attr("class", "tooltip")
	
	tooltip.append("d")

	
	// legend
	var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d,i){
			var height = legendRectSize + legendSpacing
			var offset = height * color.domain().length / 2
			var horz = 5 * legendRectSize
			var vert = i * height - offset
			return "translate(" + horz + "," + (vert - 16) + ")";
		})

	legend.append("rect")
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("fill", color)
		.style("stroke", color)
	
	legend.append("text")
		.data(input)
		.attr("x", legendRectSize + 2 * legendSpacing)
		.attr("y", legendRectSize - legendSpacing)
		.text(function(d){ return d.label; })
}


function update(input){

}
