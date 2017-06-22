queue()
    .defer(d3.json, "/test/diabetes")
    //.defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, diabetesJson) {
	
	//Clean projectsJson data
	var donorschooseProjects = diabetesJson;
	var dateFormat = d3.time.format("%d-%b-%y");
	donorschooseProjects.forEach(function(d) {
		if(d["START_DATE"] === "")
		{
			d["START_DATE"] = "3-30-30"
		}
		if(d["END_DATE"] === "")
		{
			d["END_DATE"] = "3-30-30"
		}

		d["START_DATE"] = dateFormat.parse(d["START_DATE"]);
		d["START_DATE"].setDate(1);
		d["END_DATE"] = dateFormat.parse(d["END_DATE"]);
		d["END_DATE"].setDate(1);
		d["AGE_IN_YEARS_NUM"] = +d["AGE_IN_YEARS_NUM"];
		d["PATIENT_ID"] = +d["PATIENT_ID"];
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(donorschooseProjects);

	//Define Dimensions
	var startDateDim = ndx.dimension(function(d) { return d["START_DATE"]; });
	var diseaseNameDim = ndx.dimension(function(d) { return d["NAME_CHAR"]; });
	var endDateDim = ndx.dimension(function(d) { return d["END_DATE"]; });
	var raceDim = ndx.dimension(function(d) { return d["RACE_CD"]; });
	var ageDim  = ndx.dimension(function(d) { return d["AGE_IN_YEARS_NUM"]; });
	var patientIdDim  = ndx.dimension(function(d) { return d["PATIENT_ID"]; });
	var genderDim  = ndx.dimension(function(d) { return d["SEX_CD"]; });


	//Calculate metrics
	var numProjectsByStartDate = startDateDim.group().reduceCount(function(d) {
		return d["PATIENT_ID"];}); 

	var numProjectsBydiseaseName = diseaseNameDim.group().reduceCount(function(d) {
		return d["NAME_CHAR"];
	});
	var numProjectsByendDate = endDateDim.group();
	var numProjectsByRace = raceDim.group().reduceCount(function(d) {
		return d["RACE_CD"];
	});
	var numProjectsByAge = ageDim.group().reduceCount(function(d) {
		return +d["AGE_IN_YEARS_NUM"];
	});;
	var numPatientById = patientIdDim.group();

	var numProjectsByGender = genderDim.group().reduceCount(function(d) {
		return d["SEX_CD"];
	});


/*
	var totalDonationsByState = stateDim.group().reduceSum(function(d) {
		return d["AGE_IN_YEARS_NUM"];
	}); */

	var all = ndx.groupAll();
	//var totalDonations = ndx.groupAll().reduceSum(function(d) {return d["AGE_IN_YEARS_NUM"];});

	//var max_state = totalDonationsByState.top(1)[0].value;

	//Define values (to be used in charts)
	var minDate = startDateDim.bottom(1)[0]["START_DATE"];
	var maxDate = startDateDim.top(1)[0]["START_DATE"];

    //Charts
	var timeChart = dc.barChart("#time-chart");
	var raceTypeChart = dc.rowChart("#resource-type-row-chart");
	var diseaseNameChart = dc.rowChart("#poverty-level-row-chart");
	var chart = dc.pieChart("#us-chart");
	var genderChart = dc.rowChart("#number-projects-nd");
	//var totalDonationsND = dc.numberDisplay("#total-donations-nd");

/*	numberProjectsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	totalDonationsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(totalDonations)
		.formatNumber(d3.format(".3s"));*/

	genderChart
		.width(300)
        .height(250)
        .dimension(genderDim)
        .group(numProjectsByGender)
        .xAxis().ticks(4); 


	timeChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(startDateDim)
		.group(numProjectsByStartDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxis().ticks(4);

	raceTypeChart
        .width(300)
        .height(250)
        .dimension(raceDim)
        .group(numProjectsByRace)
        .xAxis().ticks(4); 

	diseaseNameChart
		.width(300)
		.height(250)
        .dimension(diseaseNameDim)
        .group(numProjectsBydiseaseName)
        .xAxis().ticks(4);

    chart
	    .width(300)
	    .height(250)
	    .innerRadius(50)
	    .dimension(ageDim)
	    .group(numProjectsByAge)
	    .legend(dc.legend())
	    // workaround for #703: not enough data is accessible through .label() to display percentages
	    .on('pretransition', function(chart) {
	        chart.selectAll('text.pie-slice').text(function(d) {
	            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
	        })
	    });

/*
	usChart.width(1000)
		.height(330)
		.dimension(stateDim)
		.group(totalDonationsByState)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_state])
		.overlayGeoJson(statesJson["features"], "state", function (d) {
			return d.properties.name;
		})
		.projection(d3.geo.albersUsa()
    				.scale(600)
    				.translate([340, 150]))
		.title(function (p) {
			return "State: " + p["key"]
					+ "\n"
					+ "Total Donations: " + Math.round(p["value"]) + " $";
		})

		*/

    dc.renderAll();

};