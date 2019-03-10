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



function plotFun(input) {

	// process data
	Object.values(input[0]).forEach(function(d){
		d.forEach(function(e) {
			delete e.Transaction
			delete e.Measure
			e.GDP = e.Datapoint
			delete e.Datapoint
			e.Year = Number(e.Year)

			Object.values(input[1]).forEach(function(a) {
				a.forEach(function(b) {
					if (e.Country === b.Country) {
						if (Number(b.Time) === e.Year){
							e.PPP = b.Datapoint
						}
					}
				})
			})

			Object.values(input[2]).forEach(function(a) {
				a.forEach(function(b) {
					if (e.Country === b.Country) {
						if (e.Year === Number(b.Time)){
							e.tourists = b.Datapoint
						}
					}
				})
			})
		})
	})

	console.log(input[0])
	var data = input[0]
	// width & height
	var w = 600
	var h = 600

	var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	svg.selectAll("circle")
		.data(input[0])
		.enter()
		.append("circle")
		.attr("cx", function(d){
			data.forEach(function(e){
				console.log(e)
				return e.PPP;
			})
		})
		.attr("cy", function(d){
			return d.GDP;
		})
		.attr("r", 5)


}
