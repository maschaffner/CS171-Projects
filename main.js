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
	d3.csv("test.csv", function(d) {
	
	// push all of the csv content into our array "data"
	data.push(d);
	  return {
		// return two of our fields in JSON format
		// The + prefix means cast to integer/float. 
		// in the first line "year_built" is our custom json key for year built
		// +d.year_built returns the field year_built from the csv file and casts it to integer/float (if possible)
		year_built: +d.year_built,
		zestimate: +d.zestimate,
        price: +d.price
        
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
		
		// width and height variables for svg
		var w = 300;
		var h = 200;
		
		// create an svg object with width and height
		var svg = d3.select(".scatterplot")
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
			return +d.zestimate * 5			
		})
				// radius of the circles
				.attr("r",function(d) {
                    return d.price/40000
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

// only called when you click on the body of the page. outputs the data as is from csv file
function showData() {
	console.log(data);
}