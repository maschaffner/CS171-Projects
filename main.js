// this is where we would store all of the content of the csv file
data = new Array();

// function to load the declared array "data" with the csv content 
// in our actual project, this function should just be used to load the data
// the plotting, etc. should occur in separate functions
function loadData() {
	// http get request to css file. 
	// this can only work with a web server running
	// create a folder X in the root of your python27 directory
	// in folder X, put all of the files (html, css, js)
	// open the python command prompt
	// type "python -m SimpleHTTServer 8888 &"
	// this will run a miniature web server on port 8888; allow your firewall to pass traffic to it
	// when loading d3.html, you will access as such: http://localhost:8888/project2/d3.html
	// there you will see everything work
	
	// makes an http get request to the web server. "d" is the content that is dumped from the csv file
	// back to the client page
	d3.csv("proj2_boston_forsale.csv", function(d) {
	
	// push all of the csv content into our array "data"
	data.push(d);
	  return {
		// return two of our fields in JSON format
		// The + prefix means cast to integer/float. 
		// in the first line "year_built" is our custom json key for year built
		// +d.year_built returns the field year_built from the csv file and casts it to integer/float (if possible)
		year_built: +d.yearBuilt,
		zestimate: +d.zestimate,
        sqFt: +d.sqFt,
        price: +d.price,
        
		// note that here we could have put all of the fields. this is just for demonstrative purposes.
	  };
	  // this is the callback function that handles any errors and results
	  // note that "rows" here only references the json objects that we created (with two fields)
	}, function(error, rows) {
	  // this means that at this point of the code, we have contained our data in two places:
	  // 1) Array "data" - holding the entire csv content as is
	  // 2) A JSON object called "rows" - holding json objects of only 2 fields (year built and zestimate)
	  // I only stored the data in two ways just for demonstration
		//uncomment below line to see json objects in console
		// console.log(rows);
		
        /* BEGIN pricePerSqFt line graph */
        createPricePerSqFtLineGraph();
        //createPricePerSqFtScatterplot();
        /* END pricePerSqFt line graph */
        
        
		// width and height variables for svg
		var w = 300;
		var h = 200;
		
		// create an svg object with width and height
		var svg = d3.select("#yearVsPrice")
				.append("svg")
				.attr("width",w)
				.attr("height",h);
		
		// create circles based on our json data. note that this is only for the append operation
		// in actual vis we'd have to also specify code for update and exit
		var circles = svg.selectAll("circle")
						 .data(rows)
						 .enter()
						 .append("circle")
						 .transition().duration(1000);
		
		// plot the circles on the x axis. since i haven't used the domain and scale capability of svg
		// (which we should ideally do), i used 1800 as a base year for year built.
		// by subtracting 1800 from year built, we'd have a reasonable residue value that could 
		// easily plot on the x axis without going out of bounds. again, this is just for demonstration
		circles.attr("cx",function(d) {
			return d.year_built - 1800;
		})
		// i put mock values for zestimate (ranging between 0 and 25) in test.csv, so that i could
		// see the points/circles plot on the y axis.
		// again, here we'd need to used domain and scaling for our real numbers
				.attr("cy",function(d) { 
			// multiplying by 10 gives the points a vertical spread. change that number and see what happens.
			return d.price/40000			
		})
				// radius of the circles
				.attr("r",function(d) {
                    return d.price/400000
                })
				// fill color of the circles
				.attr("fill",function(d) {
                    if (d.price>700000) return "red";
                    else if (d.price<400000) return "green";
                    else return "blue";
                })
                .attr("stroke","black");
	});
	/**
		REMINDER: BY DEFAULT, SVG'S X=0 AND Y=0 START ON TOP LEFT. 
		WE'D HAVE TO USE THE SVG BUILT IN FUNCTIONS AS WE DID IN HOMEWORK TO HAVE THE VISUALS
		ALIGN RIGHT SIDE UP
	*/
}
/* PricePerSqFtScatterplot
function createPricePerSqFtScatterplot() {
        var w = 450;
		var h = 300;
		
		// create an svg object with width and height
		var svg = d3.select("#pricePerSqFt")
				.append("svg")
				.attr("width",w)
				.attr("height",h);
		
		// create circles based on our json data. note that this is only for the append operation
		// in actual vis we'd have to also specify code for update and exit
		var circles = svg.selectAll("circle")
						 .data(data)
						 .enter()
						 .append("circle")
						 .transition().duration(1000);
		
        var xScale = d3.scale.linear()
            .range([0, w])
            .domain([0,4000]);

        var yScale = d3.scale.linear()
            .range([0,h])
            .domain(d3.extent(data,function(d) {return d.price}));
		// plot the circles on the x axis. since i haven't used the domain and scale capability of svg
		// (which we should ideally do), i used 1800 as a base year for year built.
		// by subtracting 1800 from year built, we'd have a reasonable residue value that could 
		// easily plot on the x axis without going out of bounds. again, this is just for demonstration
		
        circles
            .attr("cx",function(d) {
                return xScale(d.sqFt);
            })
		    .attr("cy",function(d) { 
                return yScale(d.price);			
            })
			// radius of the circles
            .attr("r","1")
			// fill color of the circles
            .attr("fill","gray")
            .attr("stroke","lightgray");
} */
// PricePerSqFtLineGraph
function createPricePerSqFtLineGraph() {
        data.sort(function(a,b) {return (b.sqFt-a.sqFt)});
        var margin = {top: 20, right: 20, bottom: 40, left: 100},
            width = 450 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
 
        var line = d3.svg.line()
            .x(function(d) { return x(d.sqFt); })
            .y(function(d) { return y(d.price); });

        var svg = d3.select("body").select("#pricePerSqFt").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        x.domain([0,4000]);
        y.domain([0,5000000]);
        
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("y", 36)
              .attr("x", 200)
              .text("Square Footage (Sq Ft)");

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", -90)
              .attr("x",-200)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Price ($)");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line)
              .style("fill","none")
              .style("stroke","#777");
}

/*** Example of smoothly filtering out values. Will NOT work on the line graph. ***/
function updateChart() {
    // Take care of the bubble plot
    var minPrice = 0;
    var minSqFt = document.getElementById("minSqFt").value;
    var maxSqFt = document.getElementById("maxSqFt").value;
    
    var data2 = data.filter(function(d) {return d.sqFt>minSqFt ? this : null});
    // this next line doesn't seem to work very well
    //yDomain = d3.extent(data2,function(d) {return d.price});
    var yDomain=[1400000,0];
    var svg = d3.select("body").select("#yearVsPrice").selectAll("circle")
        .data(data2);
    svg.exit().transition()
        .attr("r","0")
        .remove()
        .duration(2000)
    
    // now update the line chart
    var xScale = d3.scale.linear()
        .domain([minSqFt,maxSqFt])
        .range([0,450]);
    var yScale = d3.scale.linear()
        .domain(yDomain)
        .range([0,250]);
    var line2 = d3.svg.line()
            .x(function(d) { return xScale(d.sqFt); })
            .y(function(d) { return yScale(d.price); });
    d3.select("body").select("#pricePerSqFt").select("path.line")
        .transition().duration(1000)
            .attr("d",line2)
            d3.select("g.x.axis").call(d3.svg.axis().scale(xScale).orient("bottom"));
            d3.select("g.y.axis").call(d3.svg.axis().scale(yScale).orient("left"));
    
    /* I'm officially giving this up. It's impossible. */

}

// only called when you click on the body of the page. outputs the data as is from csv file
function showData() {
	console.log(data);
}