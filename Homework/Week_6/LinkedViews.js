// Sofie Löhr, 11038926

// loading data
var requests = [d3v5.json("data.json"),d3v5.json("data_world.json")];

Promise.all(requests).then(function(response) {
	// world pie chart data
	var world_data = world_pie(response[1])
	
	// world map data & map
	var map = process(response[0]);
	worldmap(map, world_data);
	
	
	// default piechart, data and country name
	var piedata = map.ARM.pie;
	var name = "Armenia"
	piechart(piedata, world_data, name);

	
});

function process(input) {
	// initialize variables
	var map  = {};

	// make dataset
	Object.values(input).forEach(function(d){
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
			if (country_variables.EFConsPerCap < 1){
				country_variables.fillKey = "low"
			}
			else if (country_variables.EFConsPerCap >= 1 && country_variables.EFConsPerCap < 2){
				country_variables.fillKey = "medium"
			}
			else if (country_variables.EFConsPerCap >= 2 && country_variables.EFConsPerCap < 4){
				country_variables.fillKey = "high"
			}
			else if (country_variables.EFConsPerCap >= 4 && country_variables.EFConsPerCap < 6){
				country_variables.fillKey = "higher"
			}
			else if (country_variables.EFConsPerCap >= 6 && country_variables.EFConsPerCap < 9){
				country_variables.fillKey = "super high"
			}
			else if (country_variables.EFConsPerCap >= 9){
				country_variables.fillKey = "ultra high"
			}

			map[d.CountryCode] = country_variables
		}
	})
	console.log(map)
	return map;
}

function world_pie(input){
	// prcess data
	var pie_data = []

	Object.values(input).forEach(function(d){
		for (var i = 0; i < 6; i++){
			pievalues = {}
			pievalues.label = Object.keys(d)[i]
			pievalues.value = d[Object.keys(d)[i]]
			pie_data.push(pievalues)
		}
	})
	return pie_data;
}

function worldmap(input, input_world){

	var fillColor = d3v5.scaleThreshold()
		.domain([1, 2, 4, 6, 9])
		.range(d3v5.schemeRdYlGn[6]);

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

		fills: function(geography, data){ return fillColor(data.EFConsPerCap);},

		fills: {
			"low": "#1a9850",
			"medium": "#91cf60",
			"high": "#d9ef8b",
			"higher": "#fee08b", 
			"super high": "#fc8d59",
			"ultra high": "#d73027",
			defaultFill: "#E0EBE0"
		},

		done: function(map) { 
			// default setting
			var code = "ARM"
			var name = "Armenia"

			map.svg.selectAll(".datamaps-subunit").on("click", function(geography){
				code = geography.id;
				name = geography.properties.name

				// if country has no data, keep previous country, else update
				if (typeof(input[code]) === "undefined"){
					alert("This country has no data. Please try another one.")
				}
				else {
					// delete elements of old piechart and make new one
					update()
					piechart(input[code].pie, input_world, name)
				}
				
			})
		}
	});

	// Add legend
	var d = d3v5.select("#container_map")
	
	var g = d.select(".datamap").append("g")
		.attr("transform", "translate(0,550)")
		.call(legend)
	
	function legend(g){
		var width = 280;
		const length = fillColor.range().length;

		const x = d3v5.scaleLinear()
			.domain([1, length - 1])
			.rangeRound([width / length, width * (length - 1) / length]);

		g.selectAll("rect")
			.data(fillColor.range())
			.join("rect")
			.attr("height", 8)
			.attr("x", function(d, i){return x(length - 1 - i);})
			.attr("width", function(d, i) {return (x(i + 1) - x(i)); })
			.attr("fill", function(d){return d;});

		g.append("text")
			.attr("y", -6)
			.attr("fill", "currentColor")
			.attr("text-anchor", "start")
			.attr("font-weight", "bold")
			.text("Ecological Footprint (global hectares)");

		g.call(d3v5.axisBottom(x)
			.tickSize(13)
			.tickFormat(function(i) {return fillColor.domain()[i - 1]} )
			.tickValues(d3v5.range(1, length)))
			.select(".domain")
			.remove();

		// title
		var t = d.select(".datamap").append("text")
			.attr("transform", "translate(0,20)")
			.style("text-anchor", "left")
			.style("font-weight", "bold")
			.style("font-size", "14pt")
			.text("Ecological Footprint worldwide")

	}
}

function piechart(input, input_world, name){
	// set width hight radius
	var w = 400
	var h = 400
	var radius = 100

	// set legend dimensions
	var legendRectSize = 25
	var legendSpacing = 3

	// define color scale
	var colorScale = d3v5.scaleOrdinal()
		.domain(["Crop land", "Grazing land", "Forest land", "Fishing ground", "Build up land", "Carbon"])
		.range(["#d9ef8b", "#91cf60", "#1a9850", "#99c5e5", "#d1573c", "#919191"])

	// world average pie
	var arc = d3v5.arc()
		.innerRadius(0)
		.outerRadius(radius)

	var svg = d3v5.select("#chart")
		.append("svg")
			.attr("width", "50%")
			.attr("height", "400px")
			.attr('viewBox','0 0 '+Math.min(w,h) +' '+Math.min(w,h) )
		
	// add title
	svg.append("text")
		.attr("x", w/2)
		.attr("y", 80)
		.attr("text-anchor", "middle")
		.style("font-weight", "bold")
		.text("World average")

	var svg1 = svg.append("g")
			.attr("transform", "translate(" + Math.min(w,h)/2 + "," + Math.min(w,h)/2 + ")")

	var pie = d3v5.pie()
		.sort(null)
		.value(function(d){ return d.value; })(input_world)	

	var path = svg1.selectAll('path')
		.data(pie)
			.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', function(d){ return colorScale(d.data.label); })

	
	// per country pie
	var svg = d3v5.select("#chart")
		.append("svg")
			.attr("width", "50%")
			.attr("height", "400px")
			.attr("float", "right")
			.attr('viewBox','0 0 '+Math.min(w,h) +' '+Math.min(w,h) )
		
	// add title
	svg.append("text")
		.attr("x", (w/2 - 100) )
		.attr("y", 80)
		.attr("text-anchor", "middle")
		.style("font-weight", "bold")
		.text(name);


	var svg1 = svg.append("g")
			.attr("transform", "translate(" + (Math.min(w,h)/2 - 100) + "," + Math.min(w,h)/2 + ")")

	var pie = d3v5.pie()
		.sort(null)
		.value(function(d){ return d.value; })(input)	

	var path = svg1.selectAll('path')
		.data(pie)
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', function(d){ return colorScale(d.data.label); })

	// tooltip
	var tooltip = d3v5.select("#chart")
		.append("div")
			.attr("class", "tooltip_piechart")
	
	tooltip.append("div")
		.attr("class", "label")
	
	tooltip.append("div")
		.attr("class", "value")

	path.on("mouseover", function(d){
		var EF_per_cat = Math.round(d.data.value * 100) / 100;
		tooltip.select(".label").html(d.data.label);
		tooltip.select(".value").html("EF: " + EF_per_cat);
		tooltip.style("display", "block");
	});
	path.on("mousemove", function(d){
		tooltip.style("top", (d3v5.event.pageY - 00) + "px")
		.style("left", (d3v5.event.pageX - 0) + "px");
	});
	path.on("mouseout", function(d){
		tooltip.style("display", "none");
	});


	// legend
	var legend = svg1.selectAll(".legend")
		.data(colorScale.domain())
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d,i){
			var height = legendRectSize + legendSpacing
			var offset = height * colorScale.domain().length / 2
			var horz = 5 * legendRectSize
			var vert = i * height - offset
			return "translate(" + horz + "," + (vert - 16) + ")";
		})

	legend.append("rect")
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("fill", colorScale)
		.style("stroke", colorScale)
	
	legend.append("text")
		.data(input)
		.attr("x", legendRectSize + 2 * legendSpacing)
		.attr("y", legendRectSize - 2 * legendSpacing)
		.text(function(d){ return d.label; })

}


function update(){
	var element = document.getElementById("chart")
	while(element.firstChild){
	element.removeChild(element.firstChild)
	}
}
