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
	
        unfilteredData = d;
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
        //createPricePerSqFtLineGraph();
        createPricePerSqFtScatterplot();
        /* END pricePerSqFt line graph */
        
        //createBulletGraph();
        
});
	/**
		REMINDER: BY DEFAULT, SVG'S X=0 AND Y=0 START ON TOP LEFT. 
		WE'D HAVE TO USE THE SVG BUILT IN FUNCTIONS AS WE DID IN HOMEWORK TO HAVE THE VISUALS
		ALIGN RIGHT SIDE UP
	*/
}
// PricePerSqFtScatterplot
function createPricePerSqFtScatterplot() {

        var margin = {top: 20, right: 20, bottom: 40, left: 100},
            width = 450 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

		// create an svg object with width and height
		var svg = d3.select("body").select("#pricePerSqFt").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("id","svgScatter")
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// create circles based on our json data. note that this is only for the append operation
		// in actual vis we'd have to also specify code for update and exit
		var circles = svg.selectAll("circle")
						 .data(data)
						 .enter()
						 .append("circle")
						 .transition().duration(1000);
		
        var xScale = d3.scale.linear()
            .range([0, width])
            .domain([0,4000]);

        var yScale = d3.scale.linear()
            .range([0,height])
            .domain(d3.extent(data,function(d) {return d.price}));

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(5);
            
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

		svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("y", 36)
              .attr("x", 100)
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
} 

/*** BEGIN BulletGraph   ***
    function createBulletGraph() {
        d3.select("#bulletGraph").select("div")
            // need to know how to access one record from the JSON object
            .data()//how to do this part
        var vertScale = d3.scale.linear()
            .range([0,100])
            .domain([0,100]);
    }
/*** END BulletGraph ***/  


/*** Example of smoothly filtering out values, by only changing visibility.*/
function updateChart() {
    // Take care of the bubble plot
    var minPrice = 0;
    var minSqFt = parseInt($("#slider-range-sqft").slider("values",0));
    var maxSqFt = parseInt($("#slider-range-sqft").slider("values",1));
    var minPrice = parseInt($("#slider-range-price").slider("values",0));
    var maxPrice = parseInt($("#slider-range-price").slider("values",1));
    
    xDomain = [minSqFt,maxSqFt];
    yDomain = [maxPrice,minPrice];

    // now update the line chart
    var xScale = d3.scale.linear()
        .domain(xDomain)
        .range([0,330]);
    var yScale = d3.scale.linear()
        .domain(yDomain)
        .range([0,240]);
        
    var svg = d3.select("body").select("#pricePerSqFt").selectAll("circle")
        .transition().duration(1000)
            .attr("cx",function(d) {return xScale(d.sqFt)})
            .attr("cy",function(d) {return yScale(d.price)})
            .attr("visibility", function(d) {
                return d.price > minPrice && d.price < maxPrice && d.sqFt > minSqFt && d.sqFt < maxSqFt ? "visible" : "hidden"});
    
    d3.select("#pricePerSqFt").select("g.x.axis")
        .transition().duration(1000)
            .call(d3.svg.axis().scale(xScale).orient("bottom").ticks(5));
    d3.select("#pricePerSqFt").select("g.y.axis")
        .transition().duration(1000)
            .call(d3.svg.axis().scale(yScale).orient("left"));

}

// only called when you click on the body of the page. outputs the data as is from csv file
function showData() {
	console.log(data);
}