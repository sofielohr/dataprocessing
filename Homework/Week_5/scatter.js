// Sofie Löhr, 11038926

// loading data
var tourismInbound = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017"
var purchasingPowerParities = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions"

var requests = [d3.json("gdp.json"), d3.json("ppp.json"), d3.json("tourists.json")];

Promise.all(requests).then(function(response) {
    plotFun(response);
}).catch(function(e){
    throw(e);
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
}

function plotFun(input) {
	// process data
	
	// iterate over countries
	Object.values(input[0]).forEach(function(d){
		// iterate over years
		d.forEach(function(e) {
			// make object for country
			var land = {}
			land.country = e.Country
			land.GDP = e.Datapoint
			
			// add object for country to the right year
			clean_data[e.Year].push(land)
		})
	})
	
	// process ppp and tourists datasets and add to clean_data
	valuesFun(input[1], "PPP")
	valuesFun(input[2], "tourists")
	var i = 0

	// delete values with not every variable 
	// iterate over years

	// width & height
	var w = 600
	var h = 600

	var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	// scales
	var padding = 40
	var xScale = d3.scaleLinear()
					.domain([0, d3.max(clean_data["2012"], function(d) {return d.PPP; })])
					.rangeRound([padding, w - padding*2])
    var yScale = d3.scaleLinear()
					.domain([d3.min(clean_data["2012"], function(d){ return d.GDP; }),  d3.max(clean_data["2012"], function(d) { return d.GDP; })])
					.rangeRound([h - padding*2, padding])
	// var rScale 
	
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

}

function valuesFun(i, name) {
	// INPUT DATA: iterate over countries
	Object.values(i).forEach(function(d){
		// INPUT DATA: iterate over years in input data
		d.forEach(function(e) {
			
			// CLEAN DATA: if year in cleandata -> select the right year & country
			if ( typeof(clean_data[e.Time]) !== "undefined") {
				clean_data[e.Time].forEach(function(f){
					if (f.country === e.Country) {
						// add the datapoint to clean_data variable
						f[name] = e.Datapoint
					}
				})
			}
		})
	})
}



