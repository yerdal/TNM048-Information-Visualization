function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    var color = d3.scale.category20();

    //initialize tooltip
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")


    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;

        //define the domain of the scatter plot axes
		x.domain([0, d3.max(data, function(d) { return d["Employment rate"]; })]);
		y.domain([0, d3.max(data, function(d) { return d["Household income"]; })]);

        console.log( d3.keys(data[0])[2]);

        draw();

    });

    function draw()
    {



        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width-50)
            .attr("y", -6)
			.data(self.data)
            .text( function(d) {
                return d3.keys(d)[2];
            })

        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 8)
            .attr("x", -100)
            .attr("dy", ".71em")
            .data(self.data)
			.text( function(d) {
                return d3.keys(d)[1];
            })



        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
			.attr("cx", function(d) {
                return x(d["Employment rate"]); //Load data
            })
			.attr("cy", function(d) {
                return y(d["Household income"]); //Load data
            })
			.attr("r", 6)
            .style("fill", function(d) { return color(d["Country"]);})

            //Define the x and y coordinate data values for the dots
            //...
            //tooltip
            .on("mouseover", function(d){
                tooltip.style("visibility", "visible");
                return tooltip.text(d["Country"]);
            })

            .on("mousemove", function(d) {
              tooltip.transition()
              .duration(200)
              .style("opacity", .9);
              tooltip.html(d["Country"] + "<br>" + d["Employment rate"])
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
                //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })

            .on("mouseout", function(d) {
              return tooltip.style("visibility", "hidden");
            })

            .on("click",  function(d) {
                sp1.selectDot(d["Country"]);
                selFeature(d["Country"]);
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
         //...
        d3.selectAll(".dot")
        .style("opacity", function(d) {
            if(value.indexOf(d["Country"]) != -1)
                return 1.0;
            else
                return 0.15;
        });
        console.log("Scatter Plot: ",value);
        return value;
    };

    //method for selecting features of other components
    function selFeature(value){
        //...
        pc1.selectLine(value);
    }

}
